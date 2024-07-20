import { Hono, Context } from "hono";
import { count, Table } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import { z, ZodSchema } from "zod";
import { DatabaseType } from "@/server/db";

interface CrudOptions<T> {
  table: Table;
  tableName: string;
  db: DatabaseType;
  createSchema: ZodSchema<T>;
  updateSchema: ZodSchema<Partial<T>>;
  references?: {
    [key: string]: {
      table: Table;
      foreignKey: string;
      displayFields?: string[];
    };
  };
}

class CrudRouter<T> {
  router: Hono;
  table: Table;
  tableName: string;
  db: DatabaseType;
  createSchema: ZodSchema<T>;
  updateSchema: ZodSchema<Partial<T>>;
  references?: {
    [key: string]: {
      table: Table;
      foreignKey: string;
      displayFields?: string[];
    };
  };

  constructor(options: CrudOptions<T>) {
    this.router = new Hono();
    this.table = options.table;
    this.tableName = options.tableName;
    this.db = options.db;
    this.createSchema = options.createSchema;
    this.updateSchema = options.updateSchema;
    this.references = options.references;

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", this.create.bind(this));
    this.router.get("/", this.list.bind(this));
    this.router.get("/:id", this.read.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }

  async create(c: Context) {
    const data = await c.req.json();
    const result = this.createSchema.safeParse(data);
    if (!result.success) {
      return c.json(
        { message: "Invalid data", errors: result.error.errors },
        400
      );
    }

    try {
      if (this.references) {
        for (const [key, ref] of Object.entries(this.references)) {
          if (result.data[key]) {
            const exists = await this.db
              .select()
              .from(ref.table)
              .where(eq(ref.table[ref.foreignKey], result.data[key]))
              .limit(1);
            if (exists.length === 0) {
              return c.json({ message: `Invalid reference for ${key}` }, 400);
            }
          }
        }
      }

      const inserted = await this.db
        .insert(this.table)
        .values(result.data)
        .returning();
      return c.json(inserted[0]);
    } catch (error) {
      return c.json({ message: "Failed to create resource", error }, 500);
    }
  }

  async list(c: Context) {
    const page = c.req.query("page") ? parseInt(c.req.query("page")!) : 1;
    const limit = c.req.query("limit") ? parseInt(c.req.query("limit")!) : 10;
    const search = c.req.query("search");

    try {
      const [totalRows] = await this.db
        .select({ count: count() })
        .from(this.table);

      let query = this.db
        .select()
        .from(this.table)
        .limit(limit)
        .offset((page - 1) * limit);

      // Check if populate parameter exists
      const populate = c.req.query("populate");
      if (this.references && populate) {
        let fieldsToPopulate: string[] = [];
        if (populate === "*") {
          fieldsToPopulate = Object.keys(this.references);
        } else {
          fieldsToPopulate = populate.split(",");
        }

        fieldsToPopulate.forEach((field) => {
          const ref = this.references?.[field.trim()];
          if (ref) {
            //@ts-expect-error
            query = query.leftJoin(
              ref.table,
              //@ts-expect-error
              eq(this.table[ref.foreignKey], ref.table.id)
            );
          }
        });
      }

      const items = await query;
      return c.json({
        data: items,
        pagination: { page, limit, total: totalRows.count },
      });
    } catch (error) {
      return c.json({ message: "Failed to retrieve resources", error }, 500);
    }
  }

  async read(c: Context) {
    const id = c.req.param("id");

    try {
      let query = this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id));

      // Check if populate parameter exists
      const populate = c.req.query("populate");
      if (this.references && populate) {
        let fieldsToPopulate: string[] = [];
        if (populate === "*") {
          fieldsToPopulate = Object.keys(this.references);
        } else {
          fieldsToPopulate = populate.split(",");
        }

        fieldsToPopulate.forEach((field) => {
          const fieldName = field.trim();
          const ref = this.references?.[fieldName];
          if (ref) {
            //@ts-expect-error
            query = query.leftJoin(
              ref.table,
              //@ts-expect-error
              eq(this.table[ref.foreignKey], ref.table.id)
            );
          }
        });
      }
      const item = await query.limit(1);

      if (item.length > 0) {
        return c.json(item[0]);
      } else {
        return c.json({ message: "Resource not found" }, 404);
      }
    } catch (error) {
      return c.json({ message: "Failed to retrieve resource", error }, 500);
    }
  }

  async update(c: Context) {
    const id = c.req.param("id");
    const data = await c.req.json();
    const result = this.updateSchema.safeParse(data);
    if (!result.success) {
      return c.json(
        { message: "Invalid data", errors: result.error.errors },
        400
      );
    }

    try {
      if (this.references) {
        for (const [key, ref] of Object.entries(this.references)) {
          if (result.data[key]) {
            const exists = await this.db
              .select()
              .from(ref.table)
              .where(eq(ref.table[ref.foreignKey], result.data[key]))
              .limit(1);
            if (exists.length === 0) {
              return c.json({ message: `Invalid reference for ${key}` }, 400);
            }
          }
        }
      }

      const updated = await this.db
        .update(this.table)
        .set(result.data)
        .where(eq(this.table.id, id))
        .returning();
      if (updated.length > 0) {
        return c.json(updated[0]);
      } else {
        return c.json({ message: "Resource not found" }, 404);
      }
    } catch (error) {
      return c.json({ message: "Failed to update resource", error }, 500);
    }
  }

  async delete(c: Context) {
    const id = c.req.param("id");
    try {
      const deleted = await this.db
        .delete(this.table)
        .where(eq(this.table.id, id))
        .returning();
      if (deleted.length > 0) {
        return c.json({ message: "Resource deleted" });
      } else {
        return c.json({ message: "Resource not found" }, 404);
      }
    } catch (error) {
      return c.json({ message: "Failed to delete resource", error }, 500);
    }
  }

  addCustomRoute(
    method: "get" | "post" | "put" | "delete",
    path: string,
    handler: (c: Context) => any
  ) {
    this.router[method](path, handler);
  }

  getRouter() {
    return this.router;
  }
}

export default CrudRouter;

import { Context, Next } from "hono";

export const errorMiddleware = async (c: Context, next: Next) => {
  try {
    await next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error caught:", error);
    // Return a 500 Internal Server Error response with the error message
    return c.json({ error: "Internal Server Error", message: error }, 500);
  }
};

import { SelectTemplate } from "~/models/templates";
import { placeTextOnImage } from ".";
import { toKebabCase, toSnakeCase } from "~/utils";

export namespace CanvasService {
  export const generateTemplateImage = async (
    template: SelectTemplate,
    name: string
  ) => {
    let templatePath = template.image as string;

    const parts = templatePath.split("/");
    parts.splice(parts.length - 1, 0, "generated");
    parts[parts.length - 1] = `${toKebabCase(name)}-${parts.at(-1)}`;

    const outputPath = parts.join("/");

    await placeTextOnImage("public/" + templatePath, "public/" + outputPath, [
      {
        text: name,
        fontColor: "black",
        fontSize: 40,
        fontName: "Arial",
        coordinates: { x: 400, y: 400 },
      },
    ]);

    return outputPath;
  };
}

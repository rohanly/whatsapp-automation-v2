import { createCanvas, loadImage } from "canvas";
import fs from "fs";

type PlaceText = {
  text: string;
  fontName: string;
  fontSize: number; // in px
  fontColor: string;
  coordinates: {
    x: number;
    y: number;
  };
};

export async function placeTextOnImage(
  imagePath: string,
  outputPath: string,
  contents: PlaceText[]
) {
  // Load the image template
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // Draw the image onto the canvas
  ctx.drawImage(image, 0, 0);

  for (let content of contents) {
    ctx.font = `${content.fontSize}px ${content.fontName}`;
    ctx.fillStyle = content.fontColor;

    ctx.fillText(content.text, content.coordinates.x, content.coordinates.y);
    console.log("Add Text ", content.text);
  }

  // Save the new image
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
}

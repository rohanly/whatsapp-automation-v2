import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { pb } from "./pocketbase";
import { differenceInSeconds, format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageURL(record: any, image: any) {
  return pb.files.getUrl(record, image);
}

// Function to format the timestamp
export const formatTimestamp = (createdDate: string | Date): string => {
  const now = new Date();
  const createdAt = new Date(createdDate);
  const difference = differenceInSeconds(now, createdAt);

  if (difference < 60) {
    return "now";
  } else if (difference < 3600) {
    const minutes = Math.floor(difference / 60);
    return `${minutes}m`;
  } else if (difference < 86400) {
    const hours = Math.floor(difference / 3600);
    return `${hours}h`;
  } else {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  }
};

// utils.ts
export const convertImageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

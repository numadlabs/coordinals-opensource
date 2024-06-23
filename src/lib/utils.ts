import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function s3ImageUrlBuilder(fileKey: string) {
  return `https://numadlabs-coordinals-test.s3.eu-central-1.amazonaws.com/${fileKey}`;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Convert prisma object into a regular js object
export function convertToPlainObject<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

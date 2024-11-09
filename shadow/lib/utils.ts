import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  // Handle special cases
  if (isNaN(value)) return "NaN";
  if (!isFinite(value)) return value > 0 ? "∞" : "-∞";

  // Handle small numbers close to zero
  if (Math.abs(value) < 0.01 && value !== 0) {
    return value.toExponential(2);
  }

  // Format numbers based on size
  if (Math.abs(value) >= 1_000_000_000) {
    return (
      (value / 1_000_000_000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }) + "B"
    );
  }
  if (Math.abs(value) >= 1_000_000) {
    return (
      (value / 1_000_000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }) + "M"
    );
  }
  if (Math.abs(value) >= 1_000) {
    return (
      (value / 1_000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
      "K"
    );
  }

  // Default formatting for regular numbers
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

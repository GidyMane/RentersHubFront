import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




// Replace the formatDate function with this version that ensures consistent formatting
export function formatDate(dateString: string) {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    // Use a fixed locale and format to ensure consistency between server and client
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC", // Use UTC to ensure consistent rendering
    }).format(date)
  } catch (error) {
    console.error("Date formatting error:", error)
    return dateString // Return the original string if there's an error
  }
}



export function formatDuration(isoDuration: string): string {
  // Remove the 'PT' prefix
  const timeStr = isoDuration.replace("PT", "");

  // Default values
  let hours = 0;
  let minutes = 0;

  // Regular expressions to extract hours and minutes
  const hoursMatch = timeStr.match(/(\d+)H/);
  const minutesMatch = timeStr.match(/(\d+)M/);

  // Parse hours if present
  if (hoursMatch) {
    hours = parseInt(hoursMatch[1], 10);
  }

  // Parse minutes if present
  if (minutesMatch) {
    minutes = parseInt(minutesMatch[1], 10);
  }

  // Build the formatted string
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`); // or `${hours}hrs` for "hrs"
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`); // or `${minutes}mins` for "mins"
  }

  // Return combined string or "0m" if no duration
  return parts.length > 0 ? parts.join(" ") : "0m";
}

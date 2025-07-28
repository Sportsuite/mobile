/**
 * Converts a timestamp (milliseconds since epoch) to a relative time string
 * @param timestamp - Timestamp in milliseconds (e.g., Date.now())
 * @returns Relative time string (e.g., "2 days ago", "1 hour ago", "just now")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

/**
 * Generates an AppDate object with current date/time
 */
export function getCurrentAppDate(): AppDate {
  const now = new Date();
  return {
    __typename: "AppDate",
    date: now.toLocaleDateString("en-US"), // "MM/DD/YYYY" format
    time: now.toLocaleTimeString("en-US"), // "HH:MM:SS AM/PM" format
    timestamp: now.getTime(), // Unix timestamp in ms
  };
}

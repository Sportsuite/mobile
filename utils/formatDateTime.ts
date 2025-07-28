export const formatDateToReadableString = (
  dateString: string | null | undefined
): string => {
  if (!dateString || typeof dateString !== "string") {
    console.warn("Invalid dateString input, using default date.");
    dateString = "01/01/1970"; // Fallback
  }

  // Split and validate format (DD/MM/YYYY)
  const dateParts = dateString.split("/");
  if (dateParts.length !== 3) {
    throw new Error("Invalid date format. Expected DD/MM/YYYY");
  }

  const [month, day, year] = dateParts.map((part) => parseInt(part, 10));

  // Validate month/day ranges
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be 1-12.`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Must be 1-31.`);
  }

  // Create date in YYYY-MM-DD format (universally safe)
  const isoFormattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const date = new Date(isoFormattedDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date (e.g., Feb 30th).");
  }

  // Format with ordinal suffix (e.g., "May 30th 2025")
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const dayWithOrdinal = day + getOrdinalSuffix(day);

  return formattedDate.replace(day.toString(), dayWithOrdinal);
};

export function formatDateTime(isoDateTime: string): [string, string] {
  // Parse the ISO 8601 string into a Date object
  const date = new Date(isoDateTime);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO 8601 datetime string");
  }

  // Format Time (e.g., "03:27pm")
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert 0 or 12 to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Pad with 0 if needed
  const time = `${formattedHours}:${formattedMinutes} ${period}`;

  // Format Date (e.g., "28th Feb 2025")
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Add ordinal suffix (st, nd, rd, th)
  const ordinalSuffix = getOrdinalSuffix(day);
  const formattedDate = `${day}${ordinalSuffix} ${month} ${year}`;

  return [time, formattedDate];
}

export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export function formatTimeFromISO(isoString: string): string {
  // Use Date object to parse the ISO string
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO 8601 datetime string");
  }

  // Get hours and minutes
  const hours = date.getHours().toString().padStart(2, "0"); // Ensure 2 digits
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2 digits

  // Return formatted time
  return `${hours}:${minutes}`;
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 10 && day < 20) return "th";
  const remainder = day % 10;
  switch (remainder) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

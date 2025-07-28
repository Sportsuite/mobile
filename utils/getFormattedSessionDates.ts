import { format, parse, eachDayOfInterval, isWithinInterval } from "date-fns";

export function getFormattedSessionDates(
  sessions: string[],
  startDateStr: string,
  endDateStr: string
): string {
  // Parse input dates
  const startDate = parse(startDateStr, "MM/dd/yyyy", new Date());
  const endDate = parse(endDateStr, "MM/dd/yyyy", new Date());

  // Get all dates in the range
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Handle single session case
  if (sessions.length === 1) {
    const sessionDay = sessions[0];
    // Check if any date in range matches the session day
    const matchingDate = dateRange.find(
      (date) => format(date, "EEEE") === sessionDay
    );

    return matchingDate
      ? format(matchingDate, "MMMM dd") // e.g., "May 04"
      : sessionDay; // e.g., "Friday"
  }

  // Check if all session days match consecutive dates in range
  const sessionDaysInRange = sessions.every((day, index) => {
    if (index >= dateRange.length) return false;
    return format(dateRange[index], "EEEE") === day;
  });

  if (sessionDaysInRange) {
    // Format as date range (e.g., "May 04 - May 06")
    return `${format(dateRange[0], "MMMM dd")} - ${format(
      dateRange[dateRange.length - 1],
      "MMMM dd"
    )}`;
  }

  // Default to day range (e.g., "Friday - Sunday")
  return `${sessions[0]} - ${sessions[sessions.length - 1]}`;
}

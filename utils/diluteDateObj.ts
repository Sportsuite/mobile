// Function to extract the day from the date string
export const getDayFromDate = (dateString: string): string => {
  const [month, day] = dateString.split("/"); // Split the date string by '/'
  return day; // Return the day part
};

// Function to extract the month shorthand from the date string
export const getMonthShorthandFromDate = (dateString: string): string => {
  const monthMapping: { [key: string]: string } = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  const [month] = dateString.split("/"); // Split the date string by '/'
  return monthMapping[month] || ""; // Map the month number to its shorthand
};

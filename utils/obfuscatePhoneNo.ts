export const obfuscatePhoneNumber = (phoneNumber: string) => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // Return original if too short to obfuscate
  if (digits.length <= 4) {
    return phoneNumber;
  }

  // Show first 4 and last 2 digits, mask the rest
  const visiblePrefix = digits.slice(0, 4);
  const visibleSuffix = digits.slice(-2);
  const maskedMiddle = "*".repeat(digits.length - 6); // Total length - (4 prefix + 2 suffix)

  return `${visiblePrefix}${maskedMiddle}${visibleSuffix}`;
};

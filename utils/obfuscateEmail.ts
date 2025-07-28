export const obfuscateEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart}@${domain}`; // No obfuscation if local part is too short
  }
  return `${localPart.slice(0, 2)}${"*".repeat(
    localPart.length - 2
  )}@${domain}`;
};

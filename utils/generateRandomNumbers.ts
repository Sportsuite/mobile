export const generateRandom15DigitNumber = (): string => {
  const randomNumber = Array.from({ length: 15 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return randomNumber;
};

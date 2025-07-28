const containsHTML = (str: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(str);
};
export default containsHTML;

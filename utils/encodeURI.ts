/**
 * Encodes a given URL string to make it safe for routing or query parameters.
 * @param url - The URL string to encode.
 * @returns The encoded URL string.
 */
export const encodeURI = (url: string): string => {
  return encodeURIComponent(url);
};

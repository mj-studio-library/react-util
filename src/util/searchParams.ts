/**
 * Serializes search params into a query-string fragment without a leading `?`.
 *
 * @param value - Search params input accepted by `URLSearchParams`.
 * @returns A serialized query string.
 *
 * @example
 * getSearchParams({ page: '1', q: 'react' }); // Returns: 'page=1&q=react'
 */
export function getSearchParams(
  value: string[][] | Record<string, string> | string | URLSearchParams,
): string {
  return '' + new URLSearchParams(value);
}

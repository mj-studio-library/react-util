export function getSearchParams(
  value: string[][] | Record<string, string> | string | URLSearchParams,
): string {
  return '' + new URLSearchParams(value);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function isNotUndefinedOrNull<T>(input: T | undefined | null): input is T {
  return input !== undefined || input !== null;
}

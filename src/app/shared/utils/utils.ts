export const isNotUndefinedOrNull = <T>(
  input: T | undefined | null
): input is T => input !== undefined || input !== null;



// eslint-disable-next-line prefer-arrow/prefer-arrow-functions

export function isNotUndefinedOrNull<T>(
  input: T | undefined | null
): input is T {
  return input !== undefined || input !== null;
}

export const fieldsNotNullOrUndefined = <T>(
  input: T
): input is { [Property in keyof T]: NonNullable<T[Property]> } => Object.values(input).every(
    (value) => value !== undefined && value !== null
  );


export const isEmpty = function (
  value: string | null | undefined | number | boolean,
): boolean {
  return value === undefined || value === null || value === '';
};

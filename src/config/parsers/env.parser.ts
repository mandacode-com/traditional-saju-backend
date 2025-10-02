export const parseIntValue = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parseString = (value: unknown): string | undefined => {
  return value ? String(value) : undefined;
};

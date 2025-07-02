export const getItemKey = (
  id: string,
  choices: Record<string, string | string[] | null>,
): string => {
  const parts = Object.entries(choices).flatMap(([key, value]) => {
    if (Array.isArray(value)) return value.sort().map((v) => `${key}:${v}`);

    return value ? [`${key}:${value}`] : [];
  });

  return `${id}_${parts.join("_")}`;
};

type ExtractKeys<T extends string> =
  T extends `${string}{${infer K}}${infer Rest}`
    ? K | ExtractKeys<Rest>
    : never;

export const interpolate = <T extends string>(
  template: T,
  values: { [K in ExtractKeys<T>]: string | number },
): string =>
  template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key as ExtractKeys<T>]) : `{${key}}`,
  );

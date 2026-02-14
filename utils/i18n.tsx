import { Fragment, type ReactNode } from "react";

type ExtractKeys<T extends string> =
  T extends `${string}{${infer K}}${infer Rest}`
    ? K | ExtractKeys<Rest>
    : never;

export const interpolate = <
  T extends string,
  V extends Record<ExtractKeys<T>, ReactNode>,
>(
  template: T,
  values: V,
): ReactNode => {
  const parts = template.split(/\{(\w+)\}/g);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const key = part as ExtractKeys<T>;

      return key in values ? (
        <Fragment key={index}>{values[key]}</Fragment>
      ) : (
        `{${key}}`
      );
    }

    return part;
  });
};

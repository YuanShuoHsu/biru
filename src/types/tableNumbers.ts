import { TABLE_NUMBERS } from "@/constants/tableNumbers";

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> =
  | Exclude<Enumerate<T>, Enumerate<F>>
  | T;

export type TableNumberParam = `${IntRange<0, typeof TABLE_NUMBERS>}`;

import { useFormatter } from "next-intl";

export const useFormatMoney = () => {
  const format = useFormatter();

  return (value: number, currency: string | null | undefined) => {
    const amount = format.number(value);

    return currency ? `${currency} ${amount}` : amount;
  };
};

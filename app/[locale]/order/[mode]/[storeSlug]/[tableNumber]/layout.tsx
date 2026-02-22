import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { tableNumbers } from "@/constants/tableNumbers";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    mode: string;
    storeSlug: string;
    tableNumber: string;
  }>;
}

const OrderModeStoreSlugTableNumberLayout = async ({
  children,
  params,
}: OrderModeStoreSlugTableNumberLayoutProps) => {
  const { locale, mode, storeSlug, tableNumber } = await params;

  setRequestLocale(locale as Locale);

  const isNumeric = /^(0|[1-9]\d*)$/.test(tableNumber);
  if (!isNumeric) return notFound();

  const maxTableNumbers = tableNumbers[storeSlug];
  const number = Number(tableNumber);

  const isValidTableNumber =
    mode === ORDER_MODE.DineIn && number >= 1 && number <= maxTableNumbers;
  if (!isValidTableNumber) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugTableNumberLayout;

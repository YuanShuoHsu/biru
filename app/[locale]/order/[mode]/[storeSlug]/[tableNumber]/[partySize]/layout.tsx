import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { PARTY_SIZE_MAX } from "@/constants/partySize";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugTableNumberPartySizeLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    mode: string;
    storeSlug: string;
    tableNumber: string;
    partySize: string;
  }>;
}

const OrderModeStoreSlugTableNumberPartySizeLayout = async ({
  children,
  params,
}: OrderModeStoreSlugTableNumberPartySizeLayoutProps) => {
  const { locale, mode, partySize } = await params;

  setRequestLocale(locale as Locale);

  if (mode !== ORDER_MODE.DineIn) return notFound();

  const isNumeric = /^(0|[1-9]\d*)$/.test(partySize);
  if (!isNumeric) return notFound();

  const size = Number(partySize);
  const isValidPartySize = size >= 1 && size <= PARTY_SIZE_MAX;
  if (!isValidPartySize) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugTableNumberPartySizeLayout;

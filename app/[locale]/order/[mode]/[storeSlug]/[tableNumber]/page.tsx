import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderModeDineInStoreSlugTableNumberSelect from "@/components/OrderModeDineInStoreSlugTableNumberSelect";

import { ORDER_MODE } from "@/constants/orderMode";

import type { Locale } from "@/i18n/routing";

import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

interface OrderModeStoreSlugTableNumberPageProps {
  params: Promise<{
    locale: Locale;
    mode: OrderMode;
    storeSlug: StoreSlug;
    tableNumber: TableNumber;
  }>;
}

const OrderModeStoreSlugTableNumberPage = async ({
  params,
}: OrderModeStoreSlugTableNumberPageProps) => {
  const { locale, mode, storeSlug, tableNumber } = await params;

  setRequestLocale(locale);

  if (mode !== ORDER_MODE.DineIn) return notFound();

  return (
    <OrderModeDineInStoreSlugTableNumberSelect
      locale={locale}
      mode={mode}
      storeSlug={storeSlug}
      tableNumber={tableNumber}
    />
  );
};

export default OrderModeStoreSlugTableNumberPage;

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { PARTY_SIZE_MAX } from "@/constants/partySize";

import type { Locale } from "@/i18n/routing";

import { MenuItem, TextField } from "@mui/material";

import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

interface OrderModeDineInStoreSlugTableNumberSelectProps {
  locale: Locale;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
}

const OrderModeDineInStoreSlugTableNumberSelect = ({
  locale,
  mode,
  storeSlug,
  tableNumber,
}: OrderModeDineInStoreSlugTableNumberSelectProps) => {
  const tOrder = useTranslations("order");

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(
      `/${locale}/order/${mode}/${storeSlug}/${tableNumber}/${event.target.value}`,
    );

  return (
    <TextField
      fullWidth
      label={tOrder("mode.dineIn.storeSlug.tableNumber.partySize.select.label")}
      name="partySize"
      onChange={handleChange}
      required
      select
      size="small"
      value={""}
    >
      {Array.from({ length: PARTY_SIZE_MAX }, (_, index) => index + 1).map(
        (count) => (
          <MenuItem key={count} value={count}>
            {tOrder(
              "mode.dineIn.storeSlug.tableNumber.partySize.select.value",
              {
                count,
              },
            )}
          </MenuItem>
        ),
      )}
    </TextField>
  );
};

export default OrderModeDineInStoreSlugTableNumberSelect;

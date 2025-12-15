"use client";

import { useRouter } from "next/navigation";

import { PARTY_SIZE_MAX } from "@/constants/partySize";

import { useI18n } from "@/context/i18n";

import { MenuItem, TextField } from "@mui/material";

import type { LocaleCode } from "@/types/locale";
import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

import { interpolate } from "@/utils/i18n";

interface OrderModeDineInStoreSlugTableNumberSelectProps {
  lang: LocaleCode;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
}

const OrderModeDineInStoreSlugTableNumberSelect = ({
  lang,
  mode,
  storeSlug,
  tableNumber,
}: OrderModeDineInStoreSlugTableNumberSelectProps) => {
  const dict = useI18n();

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(
      `/${lang}/order/${mode}/${storeSlug}/${tableNumber}/${event.target.value}`,
    );

  return (
    <TextField
      fullWidth
      label={
        dict.order.mode.dineIn.storeSlug.tableNumber.partySize.select.label
      }
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
            {interpolate(
              dict.order.mode.dineIn.storeSlug.tableNumber.partySize.select
                .value,
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

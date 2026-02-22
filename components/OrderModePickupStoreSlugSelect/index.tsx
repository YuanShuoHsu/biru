"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import type { Locale } from "@/i18n/routing";

import { MenuItem, TextField } from "@mui/material";

import type { OrderMode } from "@/types/orderMode";
import type { Store, StoreSlug } from "@/types/stores";

interface OrderModePickupStoreSlugSelectProps {
  locale: Locale;
  mode: OrderMode;
  storeSlug: StoreSlug;
}

const OrderModePickupStoreSlugSelect = ({
  locale,
  mode,
  storeSlug,
}: OrderModePickupStoreSlugSelectProps) => {
  const tOrder = useTranslations("order");

  const router = useRouter();

  const { data: stores = [] } = useSWR<Store[]>("/api/stores");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/${locale}/order/${mode}/${event.target.value}`);

  return (
    <TextField
      // error={!!state?.errors?.storeSlug}
      fullWidth
      // helperText={state?.errors?.storeSlug}
      label={tOrder("mode.pickup.select.label")}
      name="storeSlug"
      onChange={handleChange}
      required
      select
      size="small"
      value={storeSlug || ""}
    >
      {stores.map(({ id, name, slug }) => (
        <MenuItem key={id} value={slug}>
          {name[locale]}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default OrderModePickupStoreSlugSelect;

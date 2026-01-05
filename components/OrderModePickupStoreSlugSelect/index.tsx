"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";

import type { Locale } from "@/app/[lang]/dictionaries";

import { MenuItem, TextField } from "@mui/material";

import { useI18nStore } from "@/providers/i18n-store-provider";

import type { OrderMode } from "@/types/orderMode";
import type { Store, StoreSlug } from "@/types/stores";

interface OrderModePickupStoreSlugSelectProps {
  lang: Locale;
  mode: OrderMode;
  storeSlug: StoreSlug;
}

const OrderModePickupStoreSlugSelect = ({
  lang,
  mode,
  storeSlug,
}: OrderModePickupStoreSlugSelectProps) => {
  const { dict } = useI18nStore((state) => state);

  const router = useRouter();

  const { data: stores = [] } = useSWR<Store[]>("/api/stores");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/${lang}/order/${mode}/${event.target.value}`);

  return (
    <TextField
      // error={!!state?.errors?.storeSlug}
      fullWidth
      // helperText={state?.errors?.storeSlug}
      label={dict.order.mode.pickup.select.label}
      name="storeSlug"
      onChange={handleChange}
      required
      select
      size="small"
      value={storeSlug || ""}
    >
      {stores.map(({ id, name, slug }) => (
        <MenuItem key={id} value={slug}>
          {name[lang]}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default OrderModePickupStoreSlugSelect;

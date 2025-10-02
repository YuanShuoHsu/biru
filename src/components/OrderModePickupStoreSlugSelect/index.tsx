"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

import { useI18n } from "@/context/i18n";

import { MenuItem, TextField } from "@mui/material";

import type { RouteParams } from "@/types/routeParams";
import { Store } from "@/types/stores";

const OrderModePickupStoreSlugSelect = () => {
  const { lang, mode, storeSlug } = useParams<RouteParams>();
  const router = useRouter();

  const { data: stores = [] } = useSWR<Store[]>("/api/stores");

  const dict = useI18n();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/${lang}/order/${mode}/${event.target.value}/0`);

  return (
    <TextField
      // error={!!state?.errors?.storeSlug}
      fullWidth
      // helperText={state?.errors?.storeSlug}
      label={dict.order.mode.pickup.selectStoreSlug}
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

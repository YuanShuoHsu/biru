"use client";

import { useParams, useRouter } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { MenuItem, TextField } from "@mui/material";

import type { RouteParams } from "@/types/routeParams";

import { stores } from "@/utils/stores";

const OrderModePickupStoreIdSelect = () => {
  const { lang, mode, storeId } = useParams<RouteParams>();
  const router = useRouter();

  const dict = useI18n();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/${lang}/order/${mode}/${event.target.value}/0`);

  return (
    <TextField
      // error={!!state?.errors?.storeId}
      fullWidth
      // helperText={state?.errors?.storeId}
      label={dict.order.mode.pickup.selectStoreId}
      name="storeId"
      onChange={handleChange}
      required
      select
      size="small"
      value={storeId || ""}
    >
      {stores.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name[lang]}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default OrderModePickupStoreIdSelect;

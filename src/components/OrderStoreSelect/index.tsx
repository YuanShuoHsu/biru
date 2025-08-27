"use client";

import { useParams, useRouter } from "next/navigation";

import { MenuItem, TextField } from "@mui/material";

import { LangStoreParam } from "@/types/locale";

import { useI18n } from "@/context/i18n";
import { stores } from "@/utils/stores";

const OrderStoreSelect = () => {
  const { lang, storeId } = useParams<LangStoreParam>();
  const router = useRouter();

  const dict = useI18n();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/${lang}/order/${event.target.value}`);

  return (
    <TextField
      // error={!!state?.errors?.storeId}
      fullWidth
      // helperText={state?.errors?.storeId}
      label={dict.order.selectStore}
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

export default OrderStoreSelect;

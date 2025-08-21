"use client";

import { useParams, useRouter } from "next/navigation";

import { MenuItem, TextField } from "@mui/material";

import { LangStoreParam } from "@/types/locale";

import { useI18n } from "@/context/i18n";
import { stores } from "@/utils/stores";

const OrderStoreSelect = () => {
  const { lang, store } = useParams<LangStoreParam>();
  const router = useRouter();

  const dict = useI18n();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/${lang}/order/${event.target.value}`);

  return (
    <TextField
      // error={!!state?.errors?.store}
      fullWidth
      // helperText={state?.errors?.store}
      label={dict.order.selectStore}
      name="store"
      onChange={handleChange}
      required
      select
      size="small"
      value={store || ""}
    >
      {stores.map(({ label, value }) => (
        <MenuItem key={value} value={value}>
          {label[lang]}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default OrderStoreSelect;

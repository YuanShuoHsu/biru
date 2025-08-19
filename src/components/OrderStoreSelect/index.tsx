"use client";

import { useParams, useRouter } from "next/navigation";

import { MenuItem, TextField } from "@mui/material";

import { LangStoreParam } from "@/types/locale";

import { stores } from "@/utils/stores";

const OrderStoreSelect = () => {
  const { lang, store } = useParams<LangStoreParam>();
  const router = useRouter();

  // const dict = useI18n();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextStore = event.target.value;
    router.push(`/${lang}/order/${nextStore}`);
  };

  return (
    <TextField
      // error={!!state?.errors?.email}
      fullWidth
      // helperText={state?.errors?.email}
      label={"Select Store"}
      name="store"
      onChange={handleChange}
      required
      select
      size="small"
      value={store ?? ""}
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

import { useParams, useRouter } from "next/navigation";

import { MenuItem, TextField } from "@mui/material";

import { LangStoreParam, LocaleCode } from "@/types/locale";

const stores: {
  value: string;
  label: Record<LocaleCode, string>;
}[] = [
  {
    label: {
      "zh-TW": "航空城店",
      "zh-CN": "航空城店",
      en: "Aerotropolis",
      ja: "エアロトロポリス店",
      ko: "에어로트로폴리스점",
    },
    value: "aerotropolis",
  },
  {
    label: {
      "zh-TW": "大園店",
      "zh-CN": "大园店",
      en: "Dayuan",
      ja: "大園店",
      ko: "다위안점",
    },
    value: "dayuan",
  },
] as const;

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

import { LocaleEnum } from "@/enums/Locale";

import type { Locale } from "@/i18n/routing";

import type { CheckoutEcpayResponse, EcpayLanguage } from "@/types/ecpay";

export const ecpayLanguages: Partial<Record<Locale, EcpayLanguage>> = {
  [LocaleEnum.En]: "ENG",
  [LocaleEnum.Ja]: "JPN",
  [LocaleEnum.Ko]: "KOR",
  [LocaleEnum.ZhCN]: "CHI",
};

export const submitEcpayCheckout = ({
  action,
  fields,
}: CheckoutEcpayResponse) => {
  const form = document.createElement("form");
  form.acceptCharset = "UTF-8";
  form.method = "POST";
  form.action = action;

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
};

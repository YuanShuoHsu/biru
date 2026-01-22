import type account from "@/app/[lang]/dictionaries/zh-TW/account.json";
import type appBar from "@/app/[lang]/dictionaries/zh-TW/appBar.json";
import type auth from "@/app/[lang]/dictionaries/zh-TW/auth.json";
import type cart from "@/app/[lang]/dictionaries/zh-TW/cart.json";
import type common from "@/app/[lang]/dictionaries/zh-TW/common.json";
import type company from "@/app/[lang]/dictionaries/zh-TW/company.json";
import type dialog from "@/app/[lang]/dictionaries/zh-TW/dialog.json";
import type home from "@/app/[lang]/dictionaries/zh-TW/home.json";
import type maintenance from "@/app/[lang]/dictionaries/zh-TW/maintenance.json";
import type order from "@/app/[lang]/dictionaries/zh-TW/order.json";
import type validation from "@/app/[lang]/dictionaries/zh-TW/validation.json";

export type I18nDict = {
  account: typeof account;
  appBar: typeof appBar;
  auth: typeof auth;
  cart: typeof cart;
  common: typeof common;
  company: typeof company;
  dialog: typeof dialog;
  home: typeof home;
  maintenance: typeof maintenance;
  order: typeof order;
  validation: typeof validation;
};

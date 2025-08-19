import { stores } from "@/utils/stores";

export type StoreValue = (typeof stores)[number]["value"];

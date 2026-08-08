import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface OrderBoardPageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({
  params,
}: OrderBoardPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return { title: t("order.board.label") };
};

const OrderBoardPage = async ({ params }: OrderBoardPageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return null;
};

export default OrderBoardPage;

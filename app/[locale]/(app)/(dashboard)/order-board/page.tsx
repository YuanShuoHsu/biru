import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface OrderBoardPageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({
  params,
}: OrderBoardPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tOrder = await getTranslations({ locale, namespace: "order" });

  return { title: tOrder("board.label") };
};

const OrderBoardPage = () => {
  return null;
};

export default OrderBoardPage;

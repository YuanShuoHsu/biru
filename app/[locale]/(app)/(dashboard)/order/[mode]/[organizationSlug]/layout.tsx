import { notFound } from "next/navigation";
import { SWRConfig } from "swr";

import MenuSocketInitializer from "./MenuSocketInitializer";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";
import ErrorAlert from "@/components/ErrorAlert";

import { API_ORDER_MODE } from "@/constants/orderMode";

import { MenuStoreProvider } from "@/providers/menu-store-provider";

import type { OrderMenu } from "@/types/menus";
import type { OrderMode } from "@/types/orderMode";

import { clientIpHeaders } from "@/utils/clientIp";
import { fetcher, settle } from "@/utils/fetcher";
import { scopeMenuToMode } from "@/utils/menus";
import { getOrganization } from "@/utils/organizations";

interface OrderModeOrganizationSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    mode: string;
    organizationSlug: string;
  }>;
}

const OrderModeOrganizationSlugLayout = async ({
  children,
  params,
}: OrderModeOrganizationSlugLayoutProps) => {
  const { locale, mode, organizationSlug } = await params;

  const { data: organization, error } = await settle(
    getOrganization(organizationSlug),
  );
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  const { data: initialMenu, error: menuError } = await settle(
    fetcher<OrderMenu | null>(
      `/api/organizations/${organization.id}/order-menu?lang=${locale}`,
      { headers: await clientIpHeaders() },
    ),
  );
  if (menuError) return <ErrorAlert />;

  const fallback = {
    [`/api/organizations/${organizationSlug}`]: organization,
  };

  return (
    <SWRConfig value={{ fallback }}>
      <MenuStoreProvider
        initialMenu={
          initialMenu &&
          scopeMenuToMode(initialMenu, API_ORDER_MODE[mode as OrderMode])
        }
      >
        <MenuSocketInitializer organizationId={organization.id} />
        <CartAnchorTemporaryDrawer />
        {children}
      </MenuStoreProvider>
    </SWRConfig>
  );
};

export default OrderModeOrganizationSlugLayout;

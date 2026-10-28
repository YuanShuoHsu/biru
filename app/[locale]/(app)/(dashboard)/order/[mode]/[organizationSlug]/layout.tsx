import { notFound } from "next/navigation";
import { SWRConfig } from "swr";

import MenuSocketInitializer from "./MenuSocketInitializer";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";
import ErrorAlert from "@/components/ErrorAlert";

import { MenuStoreProvider } from "@/providers/menu-store-provider";

import type { OrderMenu } from "@/types/menus";

import { fetcher, settle } from "@/utils/fetcher";
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
  const { locale, organizationSlug } = await params;

  const { data: organization, error } = await settle(
    getOrganization(organizationSlug),
  );
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  const { data: initialMenu, error: menuError } = await settle(
    fetcher<OrderMenu | null>(
      `/api/organizations/${organization.id}/order-menu?lang=${locale}`,
    ),
  );
  if (menuError) return <ErrorAlert />;

  const fallback = {
    [`/api/organizations/${organizationSlug}`]: organization,
  };

  return (
    <SWRConfig value={{ fallback }}>
      <MenuStoreProvider initialMenu={initialMenu}>
        <MenuSocketInitializer organizationId={organization.id} />
        <CartAnchorTemporaryDrawer />
        {children}
      </MenuStoreProvider>
    </SWRConfig>
  );
};

export default OrderModeOrganizationSlugLayout;

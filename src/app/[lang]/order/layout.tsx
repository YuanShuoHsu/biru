"use client";

import { useParams, usePathname } from "next/navigation";

import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { Stack } from "@mui/material";

interface OrderLayoutProps {
  children: React.ReactNode;
}

const OrderLayout = ({ children }: OrderLayoutProps) => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const isOrderPage = pathname === `/${lang}/order/${tableNumber}`;

  return (
    <Stack padding={2} height="100%" gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <RouterBreadcrumbs />
        {isOrderPage && (
          <Stack direction="row" alignItems="center" gap={2}>
            <OrderSearch />
            <ViewToggleButtons />
          </Stack>
        )}
      </Stack>
      {children}
    </Stack>
  );
};

export default OrderLayout;

"use client";

import { useParams, usePathname } from "next/navigation";

import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";

import { Stack } from "@mui/material";

interface OrderLayoutProps {
  children: React.ReactNode;
}

const OrderLayout = ({ children }: OrderLayoutProps) => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const isOrderPage = pathname === `/${lang}/order/${tableNumber}`;

  return (
    <Stack height="100%" direction="column" spacing={2} padding={2}>
      <Stack
        minHeight={40}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <RouterBreadcrumbs />
        {isOrderPage && <OrderSearch />}
      </Stack>
      {children}
    </Stack>
  );
};

export default OrderLayout;

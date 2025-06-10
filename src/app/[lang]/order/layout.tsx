"use client";

import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";

import { drawerWidth } from "@/constants/responsiveDrawer";

import { styled } from "@mui/material/styles";

import { Box, Stack, Toolbar } from "@mui/material";
import { useParams, usePathname } from "next/navigation";

const MainBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

interface OrderLayoutProps {
  children: React.ReactNode;
}

const OrderLayout = ({ children }: OrderLayoutProps) => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const isOrderPage = pathname === `/${lang}/order/${tableNumber}`;

  return (
    <MainBox as="main">
      <Toolbar />
      <Stack height="100%" direction="column" spacing={2}>
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
    </MainBox>
  );
};

export default OrderLayout;

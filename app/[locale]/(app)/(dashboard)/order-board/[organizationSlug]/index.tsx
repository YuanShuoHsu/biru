"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import { menuSocket } from "@/app/socket";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import {
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { orderBoardStatusValues } from "@/types/api";
import type { OrderBoardItem } from "@/types/orders";
import type { OrganizationResponse } from "@/types/organizations";

const StyledContainerGrid = styled(Grid)(({ theme }) => ({
  flex: 1,
  minHeight: 0,

  [theme.breakpoints.up("md")]: {
    flexWrap: "nowrap",
  },
}));

const StyledColumnGrid = styled(Grid)({
  alignSelf: "stretch",
});

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "highlighted",
})<{ highlighted?: boolean }>(({ highlighted, theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  ...(highlighted && {
    backgroundColor: `rgba(${theme.vars.palette.success.mainChannel} / 0.2)`,
    borderColor: theme.vars.palette.success.main,
  }),
}));

const StyledList = styled(List)({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

const StyledEmptyTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "mine",
})<{ mine?: boolean }>(({ mine, theme }) => ({
  ...(mine && {
    outline: `3px solid ${theme.vars.palette.warning.main}`,
    outlineOffset: -3,
  }),
}));

const StyledListItemText = styled(ListItemText)({
  "& .MuiListItemText-primary": {
    fontVariantNumeric: "tabular-nums",
    fontWeight: "bold",
    lineHeight: 1.2,
    fontSize: "clamp(1.5rem, 3vw, 3rem)",
  },
});

interface OrderBoardProps {
  items: OrderBoardItem[];
  organization: OrganizationResponse;
}

const OrderBoard = ({ items: initialItems, organization }: OrderBoardProps) => {
  const tOrder = useTranslations("order");

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: items = initialItems, mutate } = useSWR<OrderBoardItem[]>(
    `/api/organizations/${organization.slug}/orders/board`,
    { fallbackData: initialItems },
  );

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    menuSocket
      .timeout(5000)
      .emitWithAck("joinPublicOrdersBoard", { organizationId: organization.id })
      .then((joined: OrderBoardItem[]) => mutate(joined, false))
      .catch(() => {});

    const handleUpdate = () => {
      mutate();
    };

    menuSocket.on("orderBoardUpdated", handleUpdate);

    return () => {
      menuSocket.off("orderBoardUpdated", handleUpdate);
    };
  }, [isConnected, mutate, organization.id]);

  return (
    <StyledContainerGrid container spacing={2}>
      {orderBoardStatusValues.map((status) => {
        const columnItems = items.filter((item) => item.orderStatus === status);

        return (
          <StyledColumnGrid key={status} size={{ xs: 12, md: 4 }}>
            <StyledCard
              highlighted={status === "OrderPickupAvailable"}
              variant="outlined"
            >
              <CardHeader
                slotProps={{ title: { component: "h2" } }}
                subheader={tOrder("board.count", { count: columnItems.length })}
                title={tOrder(`board.status.${status}`)}
              />
              <Divider />
              <StyledList>
                {columnItems.length ? (
                  columnItems.map((item) => (
                    <StyledListItem
                      key={item.orderId}
                      mine={item.orderId === orderId}
                    >
                      <StyledListItemText
                        primary={item.orderNumber}
                        secondary={
                          item.orderId === orderId ? tOrder("board.mine") : null
                        }
                      />
                    </StyledListItem>
                  ))
                ) : (
                  <StyledEmptyTypography color="text.secondary" variant="body2">
                    {tOrder("board.empty")}
                  </StyledEmptyTypography>
                )}
              </StyledList>
            </StyledCard>
          </StyledColumnGrid>
        );
      })}
    </StyledContainerGrid>
  );
};

export default OrderBoard;

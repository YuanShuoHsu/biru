"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import { menuSocket } from "@/app/socket";

import { MODE_COLORS } from "@/constants/orderMode";
import { STATUS_COLORS } from "@/constants/orders";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import {
  Card,
  CardHeader,
  Chip,
  type ChipProps,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
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
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: ChipProps["color"] }>(({ color, theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  ...(color &&
    color !== "default" && {
      borderTop: `3px solid ${theme.vars.palette[color].main}`,
    }),
}));

const StyledCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: ChipProps["color"] }>(({ color, theme }) =>
  color && color !== "default"
    ? {
        backgroundColor: `rgba(${theme.vars.palette[color].mainChannel} / 0.12)`,
      }
    : {},
);

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
    outline: `3px solid ${theme.vars.palette.primary.main}`,
    outlineOffset: -3,
  }),
}));

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
        const statusLabel = tOrder(`board.status.${status}`);

        return (
          <StyledColumnGrid key={status} size={{ xs: 12, md: 4 }}>
            <StyledCard color={STATUS_COLORS[status]} variant="outlined">
              <StyledCardHeader
                color={STATUS_COLORS[status]}
                slotProps={{
                  subheader: { variant: "body2" },
                  title: { component: "h2", variant: "body2" },
                }}
                subheader={tOrder("board.count", { count: columnItems.length })}
                title={statusLabel}
              />
              <Divider />
              <StyledList>
                {columnItems.length ? (
                  columnItems.map((item, index) => (
                    <StyledListItem
                      divider={index < columnItems.length - 1}
                      key={item.orderId}
                      mine={item.orderId === orderId}
                    >
                      <ListItemText
                        primary={
                          <Stack
                            flexWrap="wrap"
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            columnGap={1}
                          >
                            <Typography variant="body1">
                              {item.orderNumber}
                            </Typography>
                            <Chip
                              color={MODE_COLORS[item.mode]}
                              label={
                                item.tableNumber
                                  ? tOrder(
                                      "mode.dineIn.storeSlug.tableNumber.value",
                                      { tableNumber: item.tableNumber },
                                    )
                                  : tOrder(`mode.${item.mode}.label`)
                              }
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                        }
                        secondary={
                          item.orderId === orderId ? tOrder("board.mine") : null
                        }
                        slotProps={{ primary: { component: "div" } }}
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

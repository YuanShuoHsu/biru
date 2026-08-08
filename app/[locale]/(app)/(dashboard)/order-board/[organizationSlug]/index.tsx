"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import { menuSocket } from "@/app/socket";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { Card, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { orderBoardStatusValues } from "@/types/api";
import type { OrderBoardItem } from "@/types/orders";
import type { OrganizationResponse } from "@/types/organizations";

// 同一份排版要同時撐住手機與店內大螢幕，字級一律隨視窗寬度縮放
const StyledColumnsStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  flexDirection: "column",
  gap: theme.spacing(2),

  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const StyledColumnCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "highlighted",
})<{ highlighted?: boolean }>(({ highlighted, theme }) => ({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  ...(highlighted && {
    backgroundColor: theme.vars.palette.success.main,
    color: theme.vars.palette.success.contrastText,
  }),
}));

const StyledNumbersStack = styled("div")(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  display: "flex",
  flexWrap: "wrap",
  alignContent: "flex-start",
  gap: theme.spacing(1),
}));

const StyledNumber = styled("span", {
  shouldForwardProp: (prop) => prop !== "mine",
})<{ mine?: boolean }>(({ mine, theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  fontVariantNumeric: "tabular-nums",
  fontWeight: "bold",
  lineHeight: 1.2,
  fontSize: "clamp(1.5rem, 4.5vw, 4rem)",
  ...(mine && {
    outline: `3px solid ${theme.vars.palette.warning.main}`,
    outlineOffset: 2,
  }),
}));

const StyledColumnTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: "clamp(1rem, 2vw, 2rem)",
}) as typeof Typography;

interface OrderBoardProps {
  items: OrderBoardItem[];
  organization: OrganizationResponse;
}

const OrderBoard = ({ items: initialItems, organization }: OrderBoardProps) => {
  const tOrder = useTranslations("order");

  const searchParams = useSearchParams();
  const myOrderNumber = searchParams.get("orderNumber");

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
    <Stack flex={1} minHeight={0} gap={2}>
      <StyledColumnsStack>
        {orderBoardStatusValues.map((status) => {
          const numbers = items
            .filter((item) => item.orderStatus === status)
            .map((item) => item.orderNumber);

          return (
            <StyledColumnCard
              highlighted={status === "OrderPickupAvailable"}
              key={status}
              variant="outlined"
            >
              <StyledColumnTitle component="h2">
                {tOrder(`board.status.${status}`)}
              </StyledColumnTitle>
              {numbers.length ? (
                <StyledNumbersStack>
                  {numbers.map((orderNumber) => (
                    <StyledNumber
                      key={orderNumber}
                      mine={orderNumber === myOrderNumber}
                    >
                      {orderNumber}
                    </StyledNumber>
                  ))}
                </StyledNumbersStack>
              ) : (
                <Typography variant="body2">{tOrder("board.empty")}</Typography>
              )}
            </StyledColumnCard>
          );
        })}
      </StyledColumnsStack>
      <Typography color="text.secondary" variant="caption">
        {tOrder("board.hint")}
      </Typography>
    </Stack>
  );
};

export default OrderBoard;

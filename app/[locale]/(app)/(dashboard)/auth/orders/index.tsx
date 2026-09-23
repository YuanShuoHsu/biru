"use client";

import dayjs from "dayjs";
import timezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomizedAccordions from "@/components/CustomizedAccordions";
import FormCard, {
  StyledCardContent,
  StyledCardHeader,
} from "@/components/FormCard";
import PaginationActions, {
  StyledTablePagination,
} from "@/components/PaginationActions";

import { MODE_COLORS, ORDER_MODE } from "@/constants/orderMode";
import { STATUS_COLORS } from "@/constants/orders";
import { getPageSizeOptions } from "@/constants/pagination";
import { STORE_TIMEZONE } from "@/constants/timezone";

import { useFormatMoney } from "@/hooks/useFormatMoney";
import { useOrderItemName } from "@/hooks/useOrderItemName";
import { useOrderModeLabel } from "@/hooks/useOrderModeLabel";

import { usePathname, useRouter } from "@/i18n/navigation";

import { useCartStore } from "@/providers/cart-store-provider";
import { useDialogStore } from "@/providers/dialog-store-provider";

import { Button, Chip, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { getCartKey } from "@/stores/cart-store";

import type { UserOrderListResponse, UserOrderResponse } from "@/types/orders";

import { getHref } from "@/utils/href";
import { getCartItems } from "@/utils/orders";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const ORDER_MODE_PATH: Record<UserOrderResponse["mode"], string> = {
  counter: ORDER_MODE.Counter,
  dineIn: ORDER_MODE.DineIn,
  driveThru: ORDER_MODE.DriveThru,
  pickup: ORDER_MODE.Pickup,
};

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const SummaryStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(1),
}));

const SummaryRowStack = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const DetailsStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

const StyledChip = styled(Chip)({
  alignSelf: "flex-start",
});

const ItemRowStack = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

const ActionsStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

interface OrdersProps {
  orders: UserOrderListResponse | null;
  page: number;
  pageSize: number;
}

const Orders = ({ orders: data, page, pageSize }: OrdersProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const { carts, replaceCart } = useCartStore((state) => state);

  const { setDialog } = useDialogStore((state) => state);

  const getOrderItemName = useOrderItemName();

  const getOrderModeLabel = useOrderModeLabel();

  const formatMoney = useFormatMoney();

  const pathname = usePathname();

  const router = useRouter();

  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tOrder = useTranslations("order");

  const orders = data?.data || [];
  const rowsPerPageOptions = getPageSizeOptions(pageSize);
  const total = data?.total || 0;

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) =>
      setExpanded(newExpanded ? panel : false);

  const getReorderLabel = (mode: UserOrderResponse["mode"]) =>
    mode === "pickup"
      ? tAuth("orders.reorder")
      : tAuth("orders.reorderAs", { mode: tOrder("mode.pickup.label") });

  const handleReorder = (order: UserOrderResponse) => () => {
    const { slug } = order.seller;

    const applyReorder = () => {
      replaceCart(ORDER_MODE.Pickup, slug, getCartItems(order.items));
      router.push(`/order/${ORDER_MODE.Pickup}/${slug}/cart`);
    };

    const targetCart = carts[getCartKey(ORDER_MODE.Pickup, slug)];

    if (!targetCart || Object.keys(targetCart).length === 0) {
      applyReorder();
      return;
    }

    setDialog({
      contentText: tAuth("orders.reorderConfirmContentText", {
        name: order.seller.name,
      }),
      onConfirm: async () => applyReorder(),
      open: true,
      title: getReorderLabel(order.mode),
    });
  };

  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) =>
    router.replace(
      `${pathname}?${new URLSearchParams({
        page: String(newPage + 1),
        pageSize: String(pageSize),
      })}`,
    );

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    router.replace(
      `${pathname}?${new URLSearchParams({
        page: "1",
        pageSize: event.target.value,
      })}`,
    );

  return (
    <FormCard>
      <StyledCardHeader
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("orders.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        {orders.length === 0 && (
          <Typography color="textSecondary" variant="body2">
            {tAuth("orders.empty")}
          </Typography>
        )}
        {orders.map((order) => {
          const currency = order.items[0]?.priceCurrency;
          const discount = Number(order.discount || 0);
          const isExpanded = expanded === order.id;
          const totalAmount =
            order.items.reduce(
              (sum, { orderQuantity, unitPrice }) =>
                sum + Number(unitPrice) * orderQuantity,
              0,
            ) - discount;

          return (
            <CustomizedAccordions
              expanded={isExpanded}
              key={order.id}
              onChange={handleChange(order.id)}
              summary={
                <SummaryStack>
                  <SummaryRowStack direction="row">
                    <StyledTypography variant="subtitle2">
                      {order.seller.name}
                    </StyledTypography>
                    <Chip
                      color={STATUS_COLORS[order.orderStatus]}
                      label={tAuth(`orders.status.${order.orderStatus}`)}
                      size="small"
                      variant="outlined"
                    />
                  </SummaryRowStack>
                  <SummaryRowStack direction="row">
                    <Typography color="textSecondary" variant="caption">
                      {dayjs(order.createdAt)
                        .tz(STORE_TIMEZONE)
                        .format("YYYY/MM/DD HH:mm:ss")}
                    </Typography>
                    <StyledTypography color="primary" variant="subtitle2">
                      {tOrder("complete.summary.total")}{" "}
                      {formatMoney(totalAmount, currency)}
                    </StyledTypography>
                  </SummaryRowStack>
                </SummaryStack>
              }
            >
              <DetailsStack>
                <Typography color="textSecondary" variant="caption">
                  {tOrder("complete.transaction.orderNo")}{" "}
                  {order.confirmationNumber || order.orderNumber}
                </Typography>
                <StyledChip
                  color={MODE_COLORS[order.mode]}
                  label={getOrderModeLabel(order.mode, order.tableNumber)}
                  size="small"
                  variant="outlined"
                />
                {order.pickupTime && (
                  <Typography color="textSecondary" variant="caption">
                    {tOrder("complete.transaction.pickupTime")}{" "}
                    {dayjs(order.pickupTime)
                      .tz(STORE_TIMEZONE)
                      .format("YYYY/MM/DD HH:mm")}
                  </Typography>
                )}
                {order.items.map((item) => (
                  <ItemRowStack direction="row" key={item.id}>
                    <Typography variant="body2">
                      {getOrderItemName(item)} {tCommon("multiply")}{" "}
                      {item.orderQuantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatMoney(
                        Number(item.unitPrice) * item.orderQuantity,
                        currency,
                      )}
                    </Typography>
                  </ItemRowStack>
                ))}
                {discount > 0 && (
                  <ItemRowStack direction="row">
                    <Typography variant="body2">
                      {tOrder("complete.summary.discount")}
                      {order.discountCode
                        ? `${tCommon("parenthesisOpen")}${order.discountCode}${tCommon("parenthesisClose")}`
                        : ""}
                    </Typography>
                    <Typography color="primary" variant="body2">
                      -{formatMoney(discount, currency)}
                    </Typography>
                  </ItemRowStack>
                )}
                {order.invoice?.invoiceNumber && (
                  <Typography color="textSecondary" variant="caption">
                    {tOrder("complete.invoice.invoiceNumber")}{" "}
                    {order.invoice.invoiceNumber}
                  </Typography>
                )}
                <SummaryRowStack direction="row">
                  <Typography color="textSecondary" variant="body2">
                    {tOrder(`checkout.payment.${order.paymentMethod}`)}
                  </Typography>
                  <ActionsStack direction="row">
                    <Button
                      href={getHref(
                        `/order/${ORDER_MODE_PATH[order.mode]}/${order.seller.slug}/complete`,
                        {
                          orderId: order.id,
                          partySize: order.partySize,
                          tableNumber: order.tableNumber,
                        },
                      )}
                      size="small"
                      variant="outlined"
                    >
                      {tAuth("orders.detail")}
                    </Button>
                    <Button
                      onClick={handleReorder(order)}
                      size="small"
                      variant="contained"
                    >
                      {getReorderLabel(order.mode)}
                    </Button>
                  </ActionsStack>
                </SummaryRowStack>
              </DetailsStack>
            </CustomizedAccordions>
          );
        })}
        {total > 0 && (
          <StyledTablePagination
            ActionsComponent={PaginationActions}
            component="div"
            count={total}
            labelDisplayedRows={({ count, from, to }) =>
              tCommon("pagination.labelDisplayedRows", { count, from, to })
            }
            labelRowsPerPage={tCommon("pagination.labelRowsPerPage")}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        )}
      </StyledCardContent>
    </FormCard>
  );
};

export default Orders;

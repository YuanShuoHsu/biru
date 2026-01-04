"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import VerticalSpacingToggleButton from "./VerticalSpacingToggleButton";

import { ecpayLocaleMap, LocaleEnum } from "@/constants/locale";

import { useI18n } from "@/context/i18n";

import {
  Button,
  Paper,
  type PaperProps,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useMenuStore } from "@/providers/menu-store-provider";

import { useCartStore } from "@/stores/useCartStore";

import type {
  CreateEcpayDto,
  EcpayLanguage,
} from "@/types/ecpay/createEcpayDto";
import type { LocaleCode } from "@/types/locale";
import type { PaymentMethod } from "@/types/payment";
import type { RouteParams } from "@/types/routeParams";

import { getChoiceNames, getItemName } from "@/utils/menu";

const getEcpayLanguage = (locale: LocaleCode): EcpayLanguage =>
  ecpayLocaleMap[locale];

const sendRequest = async (url: string, { arg }: { arg: CreateEcpayDto }) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());

const StyledPaper = styled((props: PaperProps) => <Paper {...props} />)(
  ({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  }),
);

const CustomerPaymentForm = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    notes: "",
  });

  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  const { lang, tableNumber } = useParams<RouteParams>();
  // const isDineIn = mode === ORDER_MODE.DineIn;

  const router = useRouter();

  const dict = useI18n();

  const { isCartEmpty, cartItemsList, cartTotalAmount } = useCartStore();
  const { menus } = useMenuStore((state) => state);

  const { isMutating, trigger } = useSWRMutation("/api/ecpay", sendRequest);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (payment === "Cash") {
      router.replace(`/order/${tableNumber}/complete`);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_NEXT_URL;
    const completeUrl = `${baseUrl}/${lang}/order/${tableNumber}/complete`;

    const dto = {
      base: {
        TotalAmount: cartTotalAmount,
        TradeDesc: "餐點付款",
        ItemName: cartItemsList
          .map(({ id, choices, quantity }) => {
            const itemName = getItemName(menus, id, LocaleEnum.ZhTW);
            const choiceNames = getChoiceNames(
              menus,
              id,
              choices,
              LocaleEnum.ZhTW,
              {
                colon: "：",
                delimiter: "、",
                joinWith: "、",
              },
            );
            const formattedChoices = choiceNames ? `[${choiceNames}]` : "";

            return `${itemName} ${formattedChoices} ${dict.common.multiply} ${quantity}`;
          })
          .join("#"),
        ChoosePayment: payment as CreateEcpayDto["base"]["ChoosePayment"],
        ClientBackURL: completeUrl,
        OrderResultURL: completeUrl,
        NeedExtraPaidInfo: "Y" as const,
        Language: getEcpayLanguage(lang),
      },
    };

    const { data } = await trigger(dto);

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const form = doc.getElementById("ecpayForm");

    if (form instanceof HTMLFormElement) {
      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <StyledPaper component="form" onSubmit={handleSubmit}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography component="span" variant="subtitle1">
          顧客資訊與付款
        </Typography>
        <Typography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          {/* {isDineIn
            ? interpolate(dict.common.tableNumber, { tableNumber })
            : dict.order.mode.pickup.label} */}
          桌號 {tableNumber}
        </Typography>
      </Stack>
      <TextField
        fullWidth
        label="姓名"
        name="name"
        onChange={handleInfoChange}
        required
        value={customerInfo.name}
      />
      <TextField
        fullWidth
        label="備註"
        multiline
        name="notes"
        onChange={handleInfoChange}
        slotProps={{
          htmlInput: {
            maxLength: 50,
          },
        }}
        value={customerInfo.notes}
      />
      {/* <CouponForm /> */}
      <VerticalSpacingToggleButton payment={payment} setPayment={setPayment} />
      <Button
        disabled={isMutating || isCartEmpty || !payment}
        fullWidth
        loading={isMutating}
        loadingPosition="start"
        size="large"
        type="submit"
        variant="contained"
      >
        下單
      </Button>
    </StyledPaper>
  );
};

export default CustomerPaymentForm;

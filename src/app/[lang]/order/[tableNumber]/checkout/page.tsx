"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";

import { useSnackbar } from "notistack";
import useSWRMutation from "swr/mutation";

import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";

import CustomizedAccordions from "@/components/CustomizedAccordions";
import VerticalSpacingToggleButton from "@/components/VerticalSpacingToggleButton";
import { CreateEcpayDto } from "@/types/ecpay/createEcpayDto";

type EcpayLanguage = "" | "ENG" | "KOR" | "JPN" | "CHI";

const mapToEcpayLanguage = (() => {
  const map: Record<string, EcpayLanguage> = {
    "zh-TW": "",
    en: "ENG",
    ja: "JPN",
    ko: "KOR",
    "zh-CN": "CHI",
  };

  return (locale: string): EcpayLanguage => map[locale];
})();

const sendRequest = async (url: string, { arg }: { arg: CreateEcpayDto }) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
};

const OrderTableNumberCheckout = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    table: "",
  });

  const [payment, setPayment] = useState<string | null>(null);

  const { itemsList, totalAmount } = useCartStore();

  const { lang, tableNumber } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const { trigger } = useSWRMutation("/api/ecpay", sendRequest);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handlePlaceOrder = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_NEXT_URL;
    const ClientBackURL = `${baseUrl}/${lang}/order/${tableNumber}/complete`;
    const OrderResultURL = ClientBackURL;

    const dto = {
      base: {
        TotalAmount: totalAmount,
        TradeDesc: "餐點付款",
        ItemName: itemsList()
          .map(
            (item) =>
              `${item.name}${item.size ? `(${item.size})` : ""} x ${item.quantity}`,
          )
          .join("#"),
        // ChoosePayment: "Credit" as const,
        ClientBackURL,
        OrderResultURL,
        NeedExtraPaidInfo: "Y" as const,
        Language: mapToEcpayLanguage(lang as string),
      },
    };

    try {
      const { data } = await trigger(dto);

      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const form = doc.getElementById("ecpayForm");

      if (form instanceof HTMLFormElement) {
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      enqueueSnackbar(String(error), { variant: "error" });
    }
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomizedAccordions />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6">顧客資訊與付款</Typography>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="顧客姓名"
                name="name"
                onChange={handleInfoChange}
                required
                value={customerInfo.name}
              />
              <TextField
                disabled
                fullWidth
                label="桌號"
                name="table"
                onChange={handleInfoChange}
                required
                value={tableNumber}
              />
              <VerticalSpacingToggleButton
                payment={payment}
                setPayment={setPayment}
              />
              <Button
                disabled={!payment}
                onClick={handlePlaceOrder}
                size="large"
                variant="contained"
              >
                下單
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default OrderTableNumberCheckout;

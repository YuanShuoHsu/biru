"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";

import { useSnackbar } from "notistack";
import useSWRMutation from "swr/mutation";

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  NoSsr,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";

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
    paymentMethod: "現金",
  });

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
          <Accordion defaultExpanded disableGutters>
            <AccordionSummary
              aria-controls="panel1-content"
              expandIcon={<ExpandMore />}
              id="panel1-header"
              sx={{
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <Typography
                component="span"
                sx={{ width: "33%", flexShrink: 0 }}
                variant="subtitle1"
              >
                總計
              </Typography>
              <Typography
                color="primary"
                component="span"
                fontWeight="bold"
                variant="h6"
              >
                NT$ {totalAmount.toLocaleString(lang)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                p: 2,
                borderTop: "1px solid rgba(0, 0, 0, .125)",
              }}
            >
              <List
                disablePadding
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <NoSsr defer fallback={<Typography>載入中...</Typography>}>
                  {itemsList().map((item, index) => (
                    <Stack key={item.id} gap={2}>
                      <ListItem disablePadding>
                        <ListItemText
                          primary={`${item.name} ${item.size ? `(${item.size})` : ""}`}
                          secondary={`NT$ ${(item.price + item.extraCost).toLocaleString(lang)} x ${item.quantity}`}
                          sx={{ m: 0 }}
                        />
                        <Typography
                          color="primary"
                          fontWeight="bold"
                          variant="body2"
                        >
                          NT${" "}
                          {(item.price * item.quantity).toLocaleString(lang)}
                        </Typography>
                      </ListItem>
                      {index < itemsList().length - 1 && (
                        <Divider component="li" />
                      )}
                    </Stack>
                  ))}
                </NoSsr>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom color="textSecondary">
              顧客資訊與付款
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                required
                label="顧客姓名"
                name="name"
                value={customerInfo.name}
                onChange={handleInfoChange}
                fullWidth
              />
              <TextField
                required
                label="桌號"
                name="table"
                value={customerInfo.table}
                onChange={handleInfoChange}
                fullWidth
              />
              <VerticalSpacingToggleButton />
              {/* <FormControl component="fieldset" sx={{ mt: 1 }}>
                <FormLabel component="legend">付款方式</FormLabel>
                <RadioGroup
                  row
                  name="paymentMethod"
                  value={customerInfo.paymentMethod}
                  onChange={handleInfoChange}
                >
                  <FormControlLabel
                    value="現金"
                    control={<Radio />}
                    label="現金"
                  />
                  <FormControlLabel
                    value="刷卡"
                    control={<Radio />}
                    label="刷卡"
                  />
                </RadioGroup>
              </FormControl> */}
              <Button
                variant="contained"
                size="large"
                onClick={handlePlaceOrder}
                sx={{ mt: 2 }}
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

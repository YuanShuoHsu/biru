import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import VerticalSpacingToggleButton from "./VerticalSpacingToggleButton";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";

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

const sendRequest = async (url: string, { arg }: { arg: CreateEcpayDto }) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());

const CustomerPaymentSection = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    table: "",
  });

  const [payment, setPayment] = useState<string | null>(null);

  const { lang, tableNumber } = useParams();

  const { itemsList, totalAmount } = useCartStore();

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
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="subtitle1">顧客資訊與付款</Typography>
        <Typography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          桌號 {tableNumber}
        </Typography>
      </Stack>
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
  );
};

export default CustomerPaymentSection;

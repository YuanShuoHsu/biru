import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import VerticalSpacingToggleButton from "./VerticalSpacingToggleButton";

import { useI18n } from "@/context/i18n";

import {
  Button,
  Paper,
  PaperProps,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import type {
  CreateEcpayDto,
  EcpayLanguage,
} from "@/types/ecpay/createEcpayDto";
import type { LocaleCode } from "@/types/locale";
import type { PaymentMethod } from "@/types/payment";

const mapToEcpayLanguage = (() => {
  const map: Record<LocaleCode, EcpayLanguage> = {
    "zh-TW": "",
    en: "ENG",
    ja: "JPN",
    ko: "KOR",
    "zh-CN": "CHI",
  };

  return (locale: LocaleCode): EcpayLanguage => map[locale];
})();

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

const CustomerPaymentSection = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    notes: "",
  });

  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  const { lang, tableNumber } = useParams();
  const router = useRouter();

  const dict = useI18n();

  const { isEmpty, itemsList, totalAmount } = useCartStore();

  const { enqueueSnackbar } = useSnackbar();

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
        TotalAmount: totalAmount,
        TradeDesc: "餐點付款",
        ItemName: itemsList
          .map(
            (item) =>
              `${item.name}${item.size ? `(${item.size})` : ""} ${dict.common.multiply} ${item.quantity}`,
          )
          .join("#"),
        ChoosePayment: payment as CreateEcpayDto["base"]["ChoosePayment"],
        ClientBackURL: completeUrl,
        OrderResultURL: completeUrl,
        NeedExtraPaidInfo: "Y" as const,
        Language: mapToEcpayLanguage(lang as LocaleCode),
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
      <VerticalSpacingToggleButton payment={payment} setPayment={setPayment} />
      <Button
        disabled={isMutating || isEmpty || !payment}
        fullWidth
        loading={isMutating}
        loadingPosition="start"
        size="large"
        variant="contained"
        type="submit"
      >
        下單
      </Button>
    </StyledPaper>
  );
};

export default CustomerPaymentSection;

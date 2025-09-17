"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";

const OrderModeStoreIdTableNumberComplete = () => {
  const { tableNumber, lang } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const isSuccess = status === null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        {isSuccess ? (
          <>
            <CheckCircleOutline
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              付款成功！
            </Typography>
            <Typography variant="body1" gutterBottom>
              感謝您的訂購（桌號 {tableNumber}）。
            </Typography>
          </>
        ) : (
          <>
            <ErrorOutline sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              付款失敗
            </Typography>
            <Typography variant="body1" gutterBottom>
              若有疑問，請洽工作人員協助。
            </Typography>
          </>
        )}
        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => router.push(`/${lang}`)}
        >
          回首頁
        </Button>
      </Paper>
    </Box>
  );
};

export default OrderModeStoreIdTableNumberComplete;

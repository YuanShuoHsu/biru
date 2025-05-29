"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";
import { brown } from "@mui/material/colors";

const Checkout = () => {
  const { itemsList, totalAmount } = useCartStore();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    table: "",
    paymentMethod: "現金",
  });

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handlePlaceOrder = () => {
    // console.log("訂單已下達", { customerInfo, items });
    // router.push("/order-success");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, py: 6, borderRadius: 2 }}>
      <Typography variant="h4" align="center" color="textPrimary">
        結帳
      </Typography>
      <Grid container spacing={4}>
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
              訂單摘要
            </Typography>
            <List>
              {itemsList().length > 0 ? (
                itemsList().map((item) => (
                  <React.Fragment key={`${item.id}-${item.size ?? "default"}`}>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${item.name}${item.size ? ` (${item.size})` : ""}`}
                        secondary={`數量: ${item.quantity} × $${item.price.toFixed(2)}`}
                      />
                      <Typography variant="body1" color="textPrimary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    <Divider sx={{ bgcolor: brown[200] }} />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="購物車內無商品" />
                </ListItem>
              )}
              <ListItem sx={{ py: 1 }}>
                <ListItemText primary="總計" />
                <Typography variant="h6" color="textPrimary">
                  ${totalAmount.toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Paper>
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
                InputProps={{ sx: { bgcolor: "white" } }}
              />
              <FormControl component="fieldset" sx={{ mt: 1 }}>
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
              </FormControl>
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
    </Container>
  );
};

export default Checkout;

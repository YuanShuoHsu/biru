"use client";

import CustomerPaymentSection from "./CustomerPaymentSection";
import CustomizedAccordions from "./CustomizedAccordions";

import { Grid } from "@mui/material";

const OrderTableNumberCheckout = () => {
  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomizedAccordions />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomerPaymentSection />
        </Grid>
      </Grid>
    </>
  );
};

export default OrderTableNumberCheckout;

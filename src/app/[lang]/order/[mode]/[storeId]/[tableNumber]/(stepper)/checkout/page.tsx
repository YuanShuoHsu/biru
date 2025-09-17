import CustomerPaymentSection from "@/components/CustomerPaymentSection";
import CustomizedAccordions from "@/components/CustomizedAccordions";

import { Grid } from "@mui/material";

const OrderModeStoreIdTableNumberCheckout = () => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <CustomizedAccordions />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <CustomerPaymentSection />
    </Grid>
  </Grid>
);

export default OrderModeStoreIdTableNumberCheckout;

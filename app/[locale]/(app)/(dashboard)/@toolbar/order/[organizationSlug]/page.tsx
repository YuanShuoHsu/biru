import { Suspense } from "react";

import OrderOrganizationSlugSelect from "@/components/OrderOrganizationSlugSelect";
import OrderSearch from "@/components/OrderSearch";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { Stack } from "@mui/material";

const OrderOrganizationSlugToolbar = () => (
  <Stack
    width={{ xs: "100%", sm: "auto" }}
    direction="row"
    justifyContent={{ xs: "space-between" }}
    alignItems="center"
    gap={2}
  >
    <Suspense>
      <OrderOrganizationSlugSelect />
    </Suspense>
    <OrderSearch />
    <ViewToggleButtons />
  </Stack>
);

export default OrderOrganizationSlugToolbar;

import { Suspense } from "react";

import OrderOrganizationSlugSelect from "@/components/OrderOrganizationSlugSelect";

const ToolbarOrderPage = () => (
  <Suspense>
    <OrderOrganizationSlugSelect />
  </Suspense>
);

export default ToolbarOrderPage;

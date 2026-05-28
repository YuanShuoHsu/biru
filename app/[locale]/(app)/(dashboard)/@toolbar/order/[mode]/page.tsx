import { Suspense } from "react";

import OrderOrganizationSlugSelect from "@/components/OrderOrganizationSlugSelect";

const ToolbarOrderModePage = () => (
  <Suspense>
    <OrderOrganizationSlugSelect />
  </Suspense>
);

export default ToolbarOrderModePage;

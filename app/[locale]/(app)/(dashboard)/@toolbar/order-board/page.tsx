import OrderBoardOrganizationTextField from "@/components/OrderBoardOrganizationTextField";

import { getOrganizations } from "@/utils/organizations";

const ToolbarOrderBoardPage = async () => {
  const organizations = await getOrganizations();

  return (
    <OrderBoardOrganizationTextField
      organizations={organizations}
      organizationSlug=""
    />
  );
};

export default ToolbarOrderBoardPage;

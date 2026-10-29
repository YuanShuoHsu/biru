import ErrorAlert from "@/components/ErrorAlert";
import OrderBoardOrganizationTextField from "@/components/OrderBoardOrganizationTextField";

import { settle } from "@/utils/fetcher";
import { getOrganizations } from "@/utils/organizations";

const ToolbarOrderBoardPage = async () => {
  const { data: organizations, error } = await settle(getOrganizations());
  if (error) return <ErrorAlert />;

  return (
    <OrderBoardOrganizationTextField
      organizations={organizations}
      organizationSlug=""
    />
  );
};

export default ToolbarOrderBoardPage;

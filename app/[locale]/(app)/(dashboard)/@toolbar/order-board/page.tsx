import ErrorAlert from "@/components/ErrorAlert";
import BoardOrganizationTextField from "@/components/BoardOrganizationTextField";

import { settle } from "@/utils/fetcher";
import { getOrganizations } from "@/utils/organizations";

const ToolbarOrderBoardPage = async () => {
  const { data: organizations, error } = await settle(getOrganizations());
  if (error) return <ErrorAlert />;

  return (
    <BoardOrganizationTextField
      board="order-board"
      organizations={organizations}
      organizationSlug=""
    />
  );
};

export default ToolbarOrderBoardPage;

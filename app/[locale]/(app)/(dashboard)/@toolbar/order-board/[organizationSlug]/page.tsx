import ErrorAlert from "@/components/ErrorAlert";
import BoardOrganizationTextField from "@/components/BoardOrganizationTextField";

import { settle } from "@/utils/fetcher";
import { getOrganizations } from "@/utils/organizations";

interface ToolbarOrderBoardOrganizationSlugPageProps {
  params: Promise<{ organizationSlug: string }>;
}

const ToolbarOrderBoardOrganizationSlugPage = async ({
  params,
}: ToolbarOrderBoardOrganizationSlugPageProps) => {
  const { organizationSlug } = await params;

  const { data: organizations, error } = await settle(getOrganizations());
  if (error) return <ErrorAlert />;

  return (
    <BoardOrganizationTextField
      board="order-board"
      organizations={organizations}
      organizationSlug={organizationSlug}
    />
  );
};

export default ToolbarOrderBoardOrganizationSlugPage;

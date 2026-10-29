import ErrorAlert from "@/components/ErrorAlert";
import OrderBoardOrganizationTextField from "@/components/OrderBoardOrganizationTextField";

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
    <OrderBoardOrganizationTextField
      organizations={organizations}
      organizationSlug={organizationSlug}
    />
  );
};

export default ToolbarOrderBoardOrganizationSlugPage;

import OrderBoardOrganizationTextField from "@/components/OrderBoardOrganizationTextField";

import { getOrganizations } from "@/utils/organizations";

interface ToolbarOrderBoardOrganizationSlugPageProps {
  params: Promise<{ organizationSlug: string }>;
}

const ToolbarOrderBoardOrganizationSlugPage = async ({
  params,
}: ToolbarOrderBoardOrganizationSlugPageProps) => {
  const { organizationSlug } = await params;

  const organizations = await getOrganizations();

  return (
    <OrderBoardOrganizationTextField
      organizations={organizations}
      organizationSlug={organizationSlug}
    />
  );
};

export default ToolbarOrderBoardOrganizationSlugPage;

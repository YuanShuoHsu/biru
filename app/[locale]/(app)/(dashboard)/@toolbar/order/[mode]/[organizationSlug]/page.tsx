import ErrorAlert from "@/components/ErrorAlert";
import OrderOrganizationTextField from "@/components/OrderOrganizationTextField";

import { settle } from "@/utils/fetcher";
import { getOrganizations } from "@/utils/organizations";

interface ToolbarOrderModeOrganizationSlugPageProps {
  params: Promise<{ mode: string; organizationSlug: string }>;
}

const ToolbarOrderModeOrganizationSlugPage = async ({
  params,
}: ToolbarOrderModeOrganizationSlugPageProps) => {
  const { mode, organizationSlug } = await params;

  const { data: organizations, error } = await settle(getOrganizations());
  if (error) return <ErrorAlert />;

  return (
    <OrderOrganizationTextField
      mode={mode}
      organizations={organizations}
      organizationSlug={organizationSlug}
    />
  );
};

export default ToolbarOrderModeOrganizationSlugPage;

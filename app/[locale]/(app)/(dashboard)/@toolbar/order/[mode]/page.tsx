import ErrorAlert from "@/components/ErrorAlert";
import OrderOrganizationTextField from "@/components/OrderOrganizationTextField";

import { settle } from "@/utils/fetcher";
import { getOrganizations } from "@/utils/organizations";

interface ToolbarOrderModePageProps {
  params: Promise<{ mode: string }>;
}

const ToolbarOrderModePage = async ({ params }: ToolbarOrderModePageProps) => {
  const { mode } = await params;

  const { data: organizations, error } = await settle(getOrganizations());
  if (error) return <ErrorAlert />;

  return (
    <OrderOrganizationTextField
      mode={mode}
      organizations={organizations}
      organizationSlug=""
    />
  );
};

export default ToolbarOrderModePage;

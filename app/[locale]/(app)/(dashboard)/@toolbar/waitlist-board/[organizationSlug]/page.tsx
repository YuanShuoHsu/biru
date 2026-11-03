import ErrorAlert from "@/components/ErrorAlert";
import BoardOrganizationTextField from "@/components/BoardOrganizationTextField";

import { settle } from "@/utils/fetcher";
import { getOrganizations } from "@/utils/organizations";

interface ToolbarWaitlistBoardOrganizationSlugPageProps {
  params: Promise<{ organizationSlug: string }>;
}

const ToolbarWaitlistBoardOrganizationSlugPage = async ({
  params,
}: ToolbarWaitlistBoardOrganizationSlugPageProps) => {
  const { organizationSlug } = await params;

  const { data: organizations, error } = await settle(getOrganizations());
  if (error) return <ErrorAlert />;

  return (
    <BoardOrganizationTextField
      board="waitlist-board"
      organizations={organizations}
      organizationSlug={organizationSlug}
    />
  );
};

export default ToolbarWaitlistBoardOrganizationSlugPage;

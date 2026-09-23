import { StyledStack } from "./styled";

import OrderPartySizeTextField from "@/components/OrderPartySizeTextField";
import OrderTableNumberChip from "@/components/OrderTableNumberChip";

import { ORDER_MODE } from "@/constants/orderMode";

interface SubheaderOrderModeOrganizationSlugCompletePageProps {
  params: Promise<{ mode: string; organizationSlug: string }>;
  searchParams: Promise<{ tableNumber?: string; partySize?: string }>;
}

const SubheaderOrderModeOrganizationSlugCompletePage = async ({
  params,
  searchParams,
}: SubheaderOrderModeOrganizationSlugCompletePageProps) => {
  const [{ mode, organizationSlug }, { tableNumber, partySize }] =
    await Promise.all([params, searchParams]);

  if (mode !== ORDER_MODE.DineIn || !tableNumber || !partySize) return null;

  return (
    <StyledStack direction="row">
      <OrderTableNumberChip tableNumber={tableNumber} />
      <OrderPartySizeTextField
        organizationSlug={organizationSlug}
        partySize={partySize}
        readOnly
        tableNumber={tableNumber}
      />
    </StyledStack>
  );
};

export default SubheaderOrderModeOrganizationSlugCompletePage;

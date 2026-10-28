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
  const [{ mode }, { tableNumber, partySize }] = await Promise.all([
    params,
    searchParams,
  ]);

  if (mode !== ORDER_MODE.DineIn || !tableNumber || !partySize) return null;

  return (
    <StyledStack direction="row">
      <OrderTableNumberChip tableNumber={tableNumber} />
      <OrderPartySizeTextField partySize={partySize} readOnly />
    </StyledStack>
  );
};

export default SubheaderOrderModeOrganizationSlugCompletePage;

import { StyledStack } from "./styled";

import OrderTableNumberChip from "@/components/OrderTableNumberChip";
import OrderPartySizeTextField from "@/components/OrderPartySizeTextField";

import { ORDER_MODE } from "@/constants/orderMode";

interface SubheaderOrderModeOrganizationSlugCheckoutPageProps {
  params: Promise<{ mode: string; organizationSlug: string }>;
  searchParams: Promise<{ tableNumber?: string; partySize?: string }>;
}

const SubheaderOrderModeOrganizationSlugCheckoutPage = async ({
  params,
  searchParams,
}: SubheaderOrderModeOrganizationSlugCheckoutPageProps) => {
  const [{ mode }, { tableNumber, partySize }] = await Promise.all([
    params,
    searchParams,
  ]);

  if (mode !== ORDER_MODE.DineIn || !tableNumber || !partySize) return null;

  return (
    <StyledStack direction="row">
      <OrderTableNumberChip tableNumber={tableNumber} />
      <OrderPartySizeTextField partySize={partySize} />
    </StyledStack>
  );
};

export default SubheaderOrderModeOrganizationSlugCheckoutPage;

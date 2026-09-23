import { StyledStack } from "./styled";

import OrderTableNumberChip from "@/components/OrderTableNumberChip";
import OrderPartySizeTextField from "@/components/OrderPartySizeTextField";

import { ORDER_MODE } from "@/constants/orderMode";

interface SubheaderOrderModeOrganizationSlugCartPageProps {
  params: Promise<{ mode: string; organizationSlug: string }>;
  searchParams: Promise<{ tableNumber?: string; partySize?: string }>;
}

const SubheaderOrderModeOrganizationSlugCartPage = async ({
  params,
  searchParams,
}: SubheaderOrderModeOrganizationSlugCartPageProps) => {
  const [{ mode, organizationSlug }, { tableNumber, partySize }] =
    await Promise.all([params, searchParams]);

  if (mode !== ORDER_MODE.DineIn || !tableNumber || !partySize) return null;

  return (
    <StyledStack direction="row">
      <OrderTableNumberChip tableNumber={tableNumber} />
      <OrderPartySizeTextField
        organizationSlug={organizationSlug}
        partySize={partySize}
        tableNumber={tableNumber}
      />
    </StyledStack>
  );
};

export default SubheaderOrderModeOrganizationSlugCartPage;

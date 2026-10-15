import type { Metadata } from "next";

import StepperLayout from "./StepperLayout";

interface OrderModeOrganizationSlugStepperLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { follow: true, index: false },
};

const OrderModeOrganizationSlugStepperLayout = ({
  children,
}: OrderModeOrganizationSlugStepperLayoutProps) => {
  return <StepperLayout>{children}</StepperLayout>;
};

export default OrderModeOrganizationSlugStepperLayout;

import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";

interface OrderModeStoreSlugTableNumberStepperLayoutProps {
  children: React.ReactNode;
}

const OrderModeStoreSlugTableNumberStepperLayout = ({
  children,
}: OrderModeStoreSlugTableNumberStepperLayoutProps) => (
  <>
    <HorizontalLinearStepper />
    {children}
  </>
);

export default OrderModeStoreSlugTableNumberStepperLayout;

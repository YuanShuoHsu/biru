import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";

interface OrderModeStoreIdTableNumberStepperLayoutProps {
  children: React.ReactNode;
}

const OrderModeStoreIdTableNumberStepperLayout = ({
  children,
}: OrderModeStoreIdTableNumberStepperLayoutProps) => (
  <>
    <HorizontalLinearStepper />
    {children}
  </>
);

export default OrderModeStoreIdTableNumberStepperLayout;

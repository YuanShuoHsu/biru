import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";

interface OrderStoreTableNumberStepperLayoutProps {
  children: React.ReactNode;
}

const OrderStoreTableNumberStepperLayout = ({
  children,
}: OrderStoreTableNumberStepperLayoutProps) => (
  <>
    <HorizontalLinearStepper />
    {children}
  </>
);

export default OrderStoreTableNumberStepperLayout;

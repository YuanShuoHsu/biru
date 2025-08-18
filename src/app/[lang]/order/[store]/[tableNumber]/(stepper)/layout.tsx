import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";

interface OrderTableNumberStepperLayoutProps {
  children: React.ReactNode;
}

const OrderTableNumberStepperLayout = ({
  children,
}: OrderTableNumberStepperLayoutProps) => (
  <>
    <HorizontalLinearStepper />
    {children}
  </>
);

export default OrderTableNumberStepperLayout;

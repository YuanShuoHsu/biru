import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";

interface OrderStepperLayoutProps {
  children: React.ReactNode;
}

const OrderStepperLayout = ({ children }: OrderStepperLayoutProps) => (
  <>
    <HorizontalLinearStepper />
    {children}
  </>
);

export default OrderStepperLayout;

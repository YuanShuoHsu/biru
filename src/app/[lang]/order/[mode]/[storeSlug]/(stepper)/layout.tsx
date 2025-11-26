import OrderStepperLayout from "@/components/OrderStepperLayout";

interface OrderModeStoreSlugStepperLayoutProps {
  children: React.ReactNode;
}

const OrderModeStoreSlugStepperLayout = ({
  children,
}: OrderModeStoreSlugStepperLayoutProps) => (
  <OrderStepperLayout>{children}</OrderStepperLayout>
);

export default OrderModeStoreSlugStepperLayout;

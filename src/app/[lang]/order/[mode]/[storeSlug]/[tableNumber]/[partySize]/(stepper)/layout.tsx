import OrderStepperLayout from "@/components/OrderStepperLayout";

interface OrderModeStoreSlugTableNumberStepperLayoutProps {
  children: React.ReactNode;
}

const OrderModeStoreSlugTableNumberStepperLayout = ({
  children,
}: OrderModeStoreSlugTableNumberStepperLayoutProps) => (
  <OrderStepperLayout>{children}</OrderStepperLayout>
);

export default OrderModeStoreSlugTableNumberStepperLayout;

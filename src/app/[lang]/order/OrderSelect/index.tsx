import OrderStoreSelect from "@/components/OrderStoreSelect";
import OrderTableSelect from "@/components/OrderTableSelect";

interface OrderSelectProps {
  showTable?: boolean;
}

const OrderSelect = ({ showTable = false }: OrderSelectProps) => (
  <>
    <OrderStoreSelect />
    {showTable && <OrderTableSelect />}
  </>
);

export default OrderSelect;

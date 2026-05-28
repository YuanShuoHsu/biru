import OrderSearch from "@/components/OrderSearch";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { Stack } from "@mui/material";

const SubheaderOrderModeOrganizationSlugPage = () => (
  <Stack direction="row" alignItems="center" gap={2}>
    <OrderSearch />
    <ViewToggleButtons />
  </Stack>
);

export default SubheaderOrderModeOrganizationSlugPage;

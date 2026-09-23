import ActionAreaCard from "./ActionAreaCard";

import { ViewGridSizes } from "@/constants/view";

import { Grid } from "@mui/material";

import { useViewStore } from "@/providers/view-store-provider";

import type { OrderMenuItem } from "@/types/menus";

interface ResponsiveGridProps {
  latestIds: Set<string>;
  menuItems: OrderMenuItem[];
  priority: boolean;
  topSoldIds: Set<string>;
}

const ResponsiveGrid = ({
  latestIds,
  menuItems,
  priority,
  topSoldIds,
}: ResponsiveGridProps) => {
  const { view } = useViewStore((state) => state);
  const viewGridSizes = ViewGridSizes[view];

  return (
    <Grid container spacing={2}>
      {menuItems.map((menuItem, index) => (
        <Grid display="flex" key={menuItem.id} size={viewGridSizes}>
          <ActionAreaCard
            isLatest={latestIds.has(menuItem.id)}
            isTopSold={topSoldIds.has(menuItem.id)}
            menuItem={menuItem}
            priority={priority && index === 0}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveGrid;

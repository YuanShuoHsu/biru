import ActionAreaCard from "./ActionAreaCard";

import { Grid } from "@mui/material";

import type { MenuItem } from "@/types/menu";

interface ResponsiveGridProps {
  items: MenuItem[];
}

const ResponsiveGrid = ({ items }: ResponsiveGridProps) => {
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => {
        return (
          <Grid
            display="flex"
            key={index}
            size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1 }}
          >
            <ActionAreaCard item={item} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ResponsiveGrid;

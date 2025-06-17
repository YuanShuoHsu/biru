import ActionAreaCard from "./ActionAreaCard";

import { Grid } from "@mui/material";

import type { MenuItem } from "@/types/menu";

interface ResponsiveGridProps {
  items: MenuItem[];
  showLatest: boolean;
  showTopSold: boolean;
}

const ResponsiveGrid = ({
  items,
  showLatest,
  showTopSold,
}: ResponsiveGridProps) => (
  <Grid container spacing={2}>
    {items.map(
      ({ id, name, description, imageUrl, inStock, options, price }, index) => (
        <Grid
          display="flex"
          key={id}
          size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }}
        >
          <ActionAreaCard
            id={id}
            name={name}
            description={description}
            imageUrl={imageUrl}
            inStock={inStock}
            options={options}
            price={price}
            showLatest={showLatest}
            {...(showTopSold ? { topSoldRank: index } : {})}
          />
        </Grid>
      ),
    )}
  </Grid>
);

export default ResponsiveGrid;

import ActionAreaCard from "./ActionAreaCard";

import { Grid } from "@mui/material";

import type { MenuItem } from "@/types/menu";

interface ResponsiveGridProps {
  items: MenuItem[];
}

const ResponsiveGrid = ({ items }: ResponsiveGridProps) => {
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1 }}>
          <ActionAreaCard
            name={item.name}
            imageUrl={item.imageUrl}
            description={item.description}
            price={
              item.sizes
                ? `${item.sizes[0].label} ${item.sizes[0].price}元起`
                : item.price && `${item.price}元`
            }
            tags={item.tags}
            inStock={item.inStock}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveGrid;

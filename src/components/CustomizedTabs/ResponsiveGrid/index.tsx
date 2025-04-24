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
        const price =
          item.sizes.length > 1
            ? `${Math.min(...item.sizes.map(({ price }) => price))}元起`
            : `${item.sizes[0].price}元`;

        const sizes = item.sizes.map(({ label }) => label).filter(Boolean);

        return (
          <Grid
            display="flex"
            key={index}
            size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1 }}
          >
            <ActionAreaCard
              description={item.description}
              imageUrl={item.imageUrl}
              inStock={item.inStock}
              name={item.name}
              price={price}
              sizes={sizes}
              tags={item.tags}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ResponsiveGrid;

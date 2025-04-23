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
        const firstSize = item.sizes?.[0];

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
              price={firstSize ? `${firstSize.price}元起` : `${item.price}元`}
              size={firstSize?.label}
              tags={item.tags}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ResponsiveGrid;

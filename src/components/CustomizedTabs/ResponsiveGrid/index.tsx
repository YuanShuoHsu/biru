import { useParams } from "next/navigation";

import ActionAreaCard from "./ActionAreaCard";

import { Grid } from "@mui/material";

import type { LangParam } from "@/types/locale";
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
}: ResponsiveGridProps) => {
  const { lang } = useParams<LangParam>();

  return (
    <Grid container spacing={2}>
      {items.map(
        ({ id, name, description, imageUrl, options, price, stock }, index) => (
          <Grid
            display="flex"
            key={id}
            size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }}
          >
            <ActionAreaCard
              id={id}
              name={name[lang]}
              description={description[lang]}
              imageUrl={imageUrl}
              options={options}
              price={price}
              showLatest={showLatest}
              stock={stock}
              {...(showTopSold ? { topSoldRank: index } : {})}
            />
          </Grid>
        ),
      )}
    </Grid>
  );
};

export default ResponsiveGrid;

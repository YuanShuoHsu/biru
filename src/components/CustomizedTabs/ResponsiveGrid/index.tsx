import { Grid } from "@mui/material";
import ActionAreaCard from "./ActionAreaCard";

interface ResponsiveGridProps {
  tabIndex: number;
}

const ResponsiveGrid = ({ tabIndex }: ResponsiveGridProps) => {
  const items = Array.from(
    { length: 8 },
    (_, i) => `Tab ${tabIndex + 1} - Item ${i + 1}`,
  );

  return (
    <Grid container spacing={2}>
      {items.map((label, index) => (
        <Grid
          key={index}
          size={{ tiny: 12, xs: 6, sm: 4, md: 3, lg: 2, xl: 1 }}
        >
          <ActionAreaCard label={label} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveGrid;

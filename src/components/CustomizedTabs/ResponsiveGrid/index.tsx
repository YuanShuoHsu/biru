import { Box, Grid } from "@mui/material";
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
    <Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {items.map((label, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 5 }}>
            <ActionAreaCard label={label} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResponsiveGrid;

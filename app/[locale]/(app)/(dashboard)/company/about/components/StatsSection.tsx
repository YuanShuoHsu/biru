import { Box, Container, Grid, Typography } from "@mui/material";

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "100%", label: "Remote global team" },
  { value: "5+", label: "Countries represented" },
];

const StatsSection = () => (
  <Box sx={{ bgcolor: "background.default", py: { xs: 8, sm: 10 } }}>
    <Container maxWidth="sm">
      <Grid container spacing={4} justifyContent="center" textAlign="center">
        {STATS.map((s) => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: "primary.main" }}
            >
              {s.value}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {s.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default StatsSection;

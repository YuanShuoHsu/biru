import { Avatar, Box, Container, Grid, Typography } from "@mui/material";

const COMMUNITY_CONTRIBUTORS = [
  { name: "Contributor A", country: "🇹🇼" },
  { name: "Contributor B", country: "🇺🇸" },
  { name: "Contributor C", country: "🇯🇵" },
  { name: "Contributor D", country: "🇩🇪" },
];

const Community = () => (
  <Box sx={{ py: { xs: 10, sm: 14 }, bgcolor: "background.paper" }}>
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}
      >
        Community contributors
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: "center", mb: 8 }}>
        Some notable community contributions that have had a lasting impact on
        Biru.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {COMMUNITY_CONTRIBUTORS.map((c, i) => (
          <Grid
            size={{ xs: 6, sm: 4, md: 3 }}
            key={i}
            sx={{ textAlign: "center" }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "action.selected",
                mx: "auto",
                mb: 1,
                fontSize: "1.25rem",
              }}
            >
              {c.country}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {c.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Community;

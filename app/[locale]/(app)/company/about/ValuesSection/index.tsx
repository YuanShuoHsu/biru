import { Box, Container, Grid, Paper, Typography } from "@mui/material";

const VALUES = [
  {
    title: "User-obsessed 💙",
    desc: "We never lose sight of who we're serving and why.",
  },
  {
    title: "Keep it simple 🚫",
    desc: "We're so not corporate—and we like it that way.",
  },
  {
    title: 'Chase "better" 🌱',
    desc: "We're driven by an unending desire to improve.",
  },
  {
    title: "Trust and deliver together 🚀",
    desc: "We choose to cultivate unity as the core of achievement.",
  },
];

const ValuesSection = () => (
  <Box paddingBlock={5} bgcolor="background.paper">
    <Container maxWidth="lg">
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
        Our values
      </Typography>
      <Typography variant="h2" sx={{ maxWidth: 500, mb: 2 }}>
        The Biru{" "}
        <Box
          component="span"
          sx={{
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main ?? theme.palette.primary.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          team pact
        </Box>
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
        The Biru team pact describes the values we embody as a company, which
        help guide us toward the experiences and results we aim to deliver.
      </Typography>
      <Grid container spacing={3}>
        {VALUES.map((v) => (
          <Grid key={v.title} size={{ xs: 12, md: 3 }}>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden", height: "100%" }}
            >
              <Box sx={{ p: 2 }}>
                <Typography
                  component="h3"
                  variant="body2"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.desc}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ValuesSection;

import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const VALUES = [
  {
    description: "We never lose sight of who we're serving and why.",
    title: "User-obsessed 💙",
  },
  {
    description: "We're so not corporate—and we like it that way.",
    title: "Keep it simple 🚫",
  },
  {
    description: "We're driven by an unending desire to improve.",
    title: 'Chase "better" 🌱',
  },
  {
    description: "We choose to cultivate unity as the core of achievement.",
    title: "Trust and deliver together 🚀",
  },
];

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const ValuesSection = () => (
  <Box paddingBlock={5} bgcolor="background.paper">
    <StyledContainer maxWidth="lg">
      <Stack gap={1}>
        <Typography
          color="primary.main"
          component="h2"
          fontWeight="bold"
          variant="body2"
        >
          Our values
        </Typography>
        <Typography
          color="text.primary"
          component="h2"
          fontWeight="bold"
          variant="h4"
        >
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
        <Typography color="text.secondary" variant="body1">
          The Biru team pact descriptionribes the values we embody as a company,
          which help guide us toward the experiences and results we aim to
          deliver.
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {VALUES.map(({ description, title }) => (
          <Grid key={title} size={{ xs: 12, md: 3 }}>
            <StyledPaper variant="outlined">
              <Typography component="h3" fontWeight="bold" variant="body2">
                <Box component="span" color="primary.main">
                  {title[0]}
                </Box>
                {title.slice(1)}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  </Box>
);

export default ValuesSection;

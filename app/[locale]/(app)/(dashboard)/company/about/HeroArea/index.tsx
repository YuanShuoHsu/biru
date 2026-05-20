import PhotoSlider from "./PhotoSlider";

import { Box, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "100%", label: "Remote global team" },
  { value: "5+", label: "Countries represented" },
];

const HeroArea = () => (
  <StyledContainer maxWidth="lg">
    <Stack alignItems="center" gap={2}>
      <Typography
        color="primary"
        component="h2"
        fontWeight="bold"
        variant="subtitle1"
      >
        About us
      </Typography>
      <Typography
        color="text.primary"
        component="h1"
        fontWeight="bold"
        textAlign="center"
        variant="h5"
      >
        We&apos;re on a mission to make
        <br />
        <Box color="primary.main" component="span">
          great coffee effortless
        </Box>
      </Typography>
      <Typography color="text.primary" variant="body1">
        We provide tools and spaces to bring a stunning coffee experience to
        life with unrivalled speed and warmth.
      </Typography>
    </Stack>
    <PhotoSlider />
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="center"
      spacing={{ xs: 4, sm: 8 }}
      sx={{ py: { xs: 6, sm: 8 }, textAlign: "center" }}
    >
      {STATS.map((s) => (
        <Box key={s.label}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "primary.light" }}
          >
            {s.value}
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            {s.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  </StyledContainer>
);

export default HeroArea;

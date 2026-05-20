import PhotoSlider from "./PhotoSlider";

import { Box, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingBlock: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const STATS = [
  { value: "2026", label: "Founded in Dayuan, Taoyuan" },
  { value: "100%", label: "Fresh ingredients daily" },
  { value: "All Day", label: "Brunch through Dinner" },
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
      <Typography color="text.primary" textAlign="center" variant="body1">
        We give guests the food, service, and space to bring a stunning dining
        experience to life with unrivalled warmth and ease.
      </Typography>
    </Stack>
    <PhotoSlider />
    <Stack
      flexWrap="wrap"
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      gap={5}
    >
      {STATS.map(({ label, value }) => (
        <Stack key={label} alignItems="center" gap={2}>
          <Typography color="primary.main" fontWeight="bold" variant="h4">
            {value}
          </Typography>
          <Typography color="text.secondary" variant="body1">
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  </StyledContainer>
);

export default HeroArea;

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
      <Typography color="text.primary" textAlign="center" variant="body1">
        We provide tools and spaces to bring a stunning coffee experience to
        life with unrivalled speed and warmth.
      </Typography>
    </Stack>
    <PhotoSlider />
    <Stack
      flexWrap="wrap"
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      gap={10}
    >
      {STATS.map(({ label, value }) => (
        <Stack key={label} alignItems="center" gap={2}>
          <Typography color="primary.main" fontWeight="bold" variant="h4">
            {value}
          </Typography>
          <Typography color="text.primary" variant="body1">
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  </StyledContainer>
);

export default HeroArea;

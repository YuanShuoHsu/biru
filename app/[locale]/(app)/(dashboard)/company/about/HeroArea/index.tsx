import { Box, Container, Stack, Typography } from "@mui/material";

const PHOTO_COLORS = [
  "#1565c0",
  "#2e7d32",
  "#6a1b9a",
  "#ad1457",
  "#00838f",
  "#e65100",
  "#37474f",
  "#4e342e",
  "#283593",
  "#558b2f",
];

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "100%", label: "Remote global team" },
  { value: "5+", label: "Countries represented" },
];

const HeroArea = () => (
  <Container maxWidth="lg">
    <Stack alignItems="center" gap={2}>
      <Typography
        color="primary"
        component="h2"
        fontWeight="bold"
        variant="body2"
      >
        About us
      </Typography>
      <Stack>
        <Typography
          color="text.primary"
          component="h1"
          fontWeight="bold"
          variant="h2"
        >
          We&apos;re on a mission to make{" "}
          <Box color="primary.main" component="span">
            great coffee effortless
          </Box>
        </Typography>
      </Stack>
      <Typography color="text.primary" variant="body1">
        We provide tools and spaces to bring a stunning coffee experience to
        life with unrivalled speed and warmth.
      </Typography>
    </Stack>
    <Box
      sx={{
        mx: { lg: -3 },
        pb: 2,
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, minWidth: "max-content" }}
      >
        {PHOTO_COLORS.map((color, i) => (
          <Box
            key={i}
            sx={{
              width: { xs: 160, sm: 200 },
              height: { xs: 120, sm: 150 },
              borderRadius: 2,
              bgcolor: color,
              flexShrink: 0,
              opacity: 0.85,
            }}
          />
        ))}
      </Stack>
    </Box>
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
  </Container>
);

export default HeroArea;

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
  <Box sx={{ bgcolor: "#0a1929", color: "white" }}>
    <Container maxWidth="lg">
      {/* Hero text */}
      <Box
        sx={{
          pt: { xs: 10, sm: 14 },
          pb: { xs: 8, sm: 12 },
          textAlign: "center",
          maxWidth: "md",
          mx: "auto",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
            fontWeight: 800,
            lineHeight: 1.15,
            mb: 3,
            letterSpacing: "-0.5px",
          }}
        >
          We&apos;re on a mission to make great coffee effortless.
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}
        >
          We provide tools and spaces to bring a stunning coffee experience to
          life with unrivalled speed and warmth.
        </Typography>
      </Box>

      {/* Photo strip */}
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

      {/* Stats */}
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
  </Box>
);

export default HeroArea;

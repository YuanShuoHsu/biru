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

const HeroArea = () => (
  <Box sx={{ bgcolor: "#0a1929" }}>
    <Box
      sx={{
        color: "white",
        pt: { xs: 10, sm: 14 },
        pb: { xs: 8, sm: 12 },
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
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
      </Container>
    </Box>

    <Box
      sx={{
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
  </Box>
);

export default HeroArea;

import { Box, Stack } from "@mui/material";

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

const TeamPhotoStrip = () => (
  <Box
    sx={{
      bgcolor: "#0a1929",
      pb: 2,
      overflowX: "auto",
      "&::-webkit-scrollbar": { display: "none" },
    }}
  >
    <Stack direction="row" spacing={1} sx={{ px: 2, minWidth: "max-content" }}>
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
);

export default TeamPhotoStrip;

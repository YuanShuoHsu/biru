import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

const CORE_TEAM = [
  {
    name: "Yuan-Shuo Hsu",
    title: "Co-founder, CEO",
    country: "🇹🇼",
    avatar: "Y",
  },
  {
    name: "Biru Member",
    title: "Co-founder, CTO",
    country: "🇹🇼",
    avatar: "B",
  },
  {
    name: "Biru Member",
    title: "Lead Engineer",
    country: "🇯🇵",
    avatar: "B",
  },
  {
    name: "Biru Member",
    title: "Product Designer",
    country: "🇰🇷",
    avatar: "B",
  },
  {
    name: "Biru Member",
    title: "Frontend Engineer",
    country: "🇺🇸",
    avatar: "B",
  },
  {
    name: "Biru Member",
    title: "Backend Engineer",
    country: "🇸🇬",
    avatar: "B",
  },
];

const TeamSection = () => (
  <Box sx={{ py: { xs: 10, sm: 14 }, bgcolor: "background.default" }}>
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}
      >
        Team
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: "center", mb: 8 }}>
        The people behind Biru.
      </Typography>
      <Grid container spacing={4}>
        {CORE_TEAM.map((member, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
            <Stack spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "primary.main",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {member.avatar}
              </Avatar>
              <Box>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {member.name}
                  </Typography>
                  <Typography>{member.country}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {member.title}
                </Typography>
              </Box>
              <IconButton
                size="small"
                aria-label="GitHub"
                sx={{ mt: -0.5, p: 0 }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default TeamSection;

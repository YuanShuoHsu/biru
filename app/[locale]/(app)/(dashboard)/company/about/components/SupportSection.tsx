import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";

const SupportSection = () => (
  <Box sx={{ py: { xs: 10, sm: 14 }, bgcolor: "background.default" }}>
    <Container maxWidth="lg">
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <FeedbackOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Give feedback
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Found a bug or have a feature request? Let us know by opening an
              issue on GitHub. We read every submission.
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href="https://github.com"
                target="_blank"
                rel="noopener"
              >
                GitHub issues
              </Button>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <GroupsOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Join the community
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Whether you are a developer, designer, or coffee enthusiast, there
              is a place for you in the Biru community.
            </Typography>
            <Box>
              <Button variant="outlined">Discord community</Button>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <FavoriteOutlinedIcon sx={{ fontSize: 40, color: "error.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Support us financially
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you use Biru in a revenue-generating product, consider
              supporting our sustainability via Open Collective.
            </Typography>
            <Box>
              <Button
                variant="outlined"
                color="error"
                href="https://opencollective.com"
                target="_blank"
                rel="noopener"
              >
                Open Collective
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default SupportSection;

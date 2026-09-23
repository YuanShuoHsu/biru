// vibe coding may be someday we need it

import {
  FavoriteOutlined,
  FeedbackOutlined,
  GitHub,
  GroupsOutlined,
} from "@mui/icons-material";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { type CSSObject, styled } from "@mui/material/styles";

const StyledBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.vars.palette.background.default,

  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(14),
    paddingBottom: theme.spacing(14),
  },
}));

const iconStyle: CSSObject = {
  fontSize: 40,
};

const StyledFeedbackOutlined = styled(FeedbackOutlined)(iconStyle);

const StyledTypography = styled(Typography)({
  fontWeight: 700,
});

const StyledGroupsOutlined = styled(GroupsOutlined)(iconStyle);

const StyledFavoriteOutlined = styled(FavoriteOutlined)(iconStyle);

const Support = () => (
  <StyledBox>
    <Container disableGutters maxWidth="lg">
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <StyledFeedbackOutlined color="primary" />
            <StyledTypography variant="h5">Give feedback</StyledTypography>
            <Typography color="textSecondary" variant="body2">
              Found a bug or have a feature request? Let us know by opening an
              issue on GitHub. We read every submission.
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<GitHub />}
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
            <StyledGroupsOutlined color="primary" />
            <StyledTypography variant="h5">Join the community</StyledTypography>
            <Typography color="textSecondary" variant="body2">
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
            <StyledFavoriteOutlined color="error" />
            <StyledTypography variant="h5">
              Support us financially
            </StyledTypography>
            <Typography color="textSecondary" variant="body2">
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
  </StyledBox>
);

export default Support;

import type { SvgIconComponent } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const VALUES: { description: string; icon: SvgIconComponent; title: string }[] =
  [
    {
      description: "We never lose sight of who we're serving and why.",
      icon: FavoriteIcon,
      title: "User-obsessed",
    },
    {
      description: "We're so not corporate—and we like it that way.",
      icon: TuneIcon,
      title: "Keep it simple",
    },
    {
      description: "We're driven by an unending desire to improve.",
      icon: TrendingUpIcon,
      title: 'Chase "better"',
    },
    {
      description: "We choose to cultivate unity as the core of achievement.",
      icon: RocketLaunchIcon,
      title: "Trust and deliver together",
    },
  ];

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.palette.primary.main + "14",
  borderRadius: theme.shape.borderRadius,
  display: "inline-flex",
  padding: theme.spacing(1),
  "& svg": {
    color: theme.palette.primary.main,
    fontSize: "1.25rem",
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

const ValuesSection = () => (
  <Box paddingBlock={5} bgcolor="background.paper">
    <StyledContainer maxWidth="lg">
      <Stack gap={1}>
        <Typography
          color="primary.main"
          component="h2"
          fontWeight="bold"
          variant="body2"
        >
          Our values
        </Typography>
        <Typography
          color="text.primary"
          component="h2"
          fontWeight="bold"
          variant="h4"
        >
          The Biru{" "}
          <Box
            component="span"
            sx={{
              background: (theme) =>
                `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main ?? theme.palette.primary.light})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            team pact
          </Box>
        </Typography>
        <Typography color="text.secondary" variant="body1">
          The Biru team pact describes the values we embody as a company, which
          help guide us toward the experiences and results we aim to deliver.
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {VALUES.map(({ description, icon: Icon, title }) => (
          <StyledGrid key={title} size={{ xs: 12, md: 3 }}>
            <Stack alignItems="center" direction="row" gap={1}>
              <IconWrapper>
                <Icon />
              </IconWrapper>
              <Typography
                color="text.primary"
                component="h3"
                fontWeight="bold"
                variant="body2"
              >
                <Box component="span" color="primary.main">
                  {title[0]}
                </Box>
                {title.slice(1)}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          </StyledGrid>
        ))}
      </Grid>
    </StyledContainer>
  </Box>
);

export default ValuesSection;

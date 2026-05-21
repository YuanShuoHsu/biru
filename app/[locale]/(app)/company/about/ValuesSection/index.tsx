import GradientBox from "@/components/GradientBox";

import {
  Favorite,
  RocketLaunch,
  TrendingUp,
  Tune,
  type SvgIconComponent,
} from "@mui/icons-material";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const VALUES: { description: string; icon: SvgIconComponent; title: string }[] =
  [
    {
      description: "We never lose sight of who we're serving and why.",
      icon: Favorite,
      title: "User-obsessed",
    },
    {
      description: "We're so not corporate—and we like it that way.",
      icon: Tune,
      title: "Keep it simple",
    },
    {
      description: "We're driven by an unending desire to improve.",
      icon: TrendingUp,
      title: 'Chase "better"',
    },
    {
      description: "We choose to cultivate unity as the core of achievement.",
      icon: RocketLaunch,
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
          The Biru <GradientBox component="span">team pact</GradientBox>
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

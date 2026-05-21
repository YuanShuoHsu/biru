import { useTranslations } from "next-intl";

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

type ValueKey =
  | "userObsessed"
  | "keepItSimple"
  | "chaseBetter"
  | "trustAndDeliver";

const VALUE_KEYS: { icon: SvgIconComponent; key: ValueKey }[] = [
  { icon: Favorite, key: "userObsessed" },
  { icon: Tune, key: "keepItSimple" },
  { icon: TrendingUp, key: "chaseBetter" },
  { icon: RocketLaunch, key: "trustAndDeliver" },
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

const Values = () => {
  const t = useTranslations("company.about.values");

  return (
    <Box paddingBlock={5} bgcolor="background.paper">
      <StyledContainer maxWidth="lg">
        <Stack gap={1}>
          <Typography
            color="primary.main"
            component="h2"
            fontWeight="bold"
            variant="body2"
          >
            {t("subtitle")}
          </Typography>
          <Typography
            color="text.primary"
            component="h2"
            fontWeight="bold"
            variant="h4"
          >
            {t("titlePrefix")}
            <GradientBox component="span">{t("titleGradient")}</GradientBox>
          </Typography>
          <Typography color="text.secondary" variant="body1">
            {t("description")}
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {VALUE_KEYS.map(({ icon: Icon, key }) => {
            const title = t(`values.${key}.title`);

            return (
              <StyledGrid key={key} size={{ xs: 12, md: 3 }}>
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
                  {t(`values.${key}.description`)}
                </Typography>
              </StyledGrid>
            );
          })}
        </Grid>
      </StyledContainer>
    </Box>
  );
};

export default Values;

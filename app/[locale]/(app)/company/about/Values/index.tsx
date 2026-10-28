import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import {
  Favorite,
  RocketLaunch,
  TrendingUp,
  Tune,
  type SvgIconComponent,
} from "@mui/icons-material";
import {
  Box,
  type BoxProps,
  Container,
  Grid,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

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

const SectionBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(5, 2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const HeaderStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const StyledTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const ValueTitleStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(1),
}));

const IconBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const InitialBox = styled(Box)<BoxProps>(({ theme }) => ({
  color: theme.vars.palette.primary.main,
}));

const Values = () => {
  const tCompanyAboutValues = useTranslations("company.about.values");

  return (
    <SectionBox component="section">
      <StyledContainer disableGutters maxWidth="lg">
        <HeaderStack>
          <StyledTypography color="primary" component="h2" variant="body2">
            {tCompanyAboutValues("subtitle")}
          </StyledTypography>
          <StyledTypography component="h2" variant="h5">
            {tCompanyAboutValues("titlePrefix")}
            <GradientBox component="span">
              {tCompanyAboutValues("titleGradient")}
            </GradientBox>
          </StyledTypography>
          <Typography color="textSecondary" variant="body1">
            {tCompanyAboutValues("description")}
          </Typography>
        </HeaderStack>
        <Grid container spacing={2}>
          {VALUE_KEYS.map(({ icon: Icon, key }) => {
            const title = tCompanyAboutValues(`values.${key}.title`);

            return (
              <StyledGrid key={key} size={{ xs: 12, md: 3 }}>
                <ValueTitleStack direction="row">
                  <IconBox>
                    <Icon color="primary" fontSize="small" />
                  </IconBox>
                  <StyledTypography component="h3" variant="body2">
                    <InitialBox component="span">{title[0]}</InitialBox>
                    {title.slice(1)}
                  </StyledTypography>
                </ValueTitleStack>
                <Typography color="textSecondary" variant="body2">
                  {tCompanyAboutValues(`values.${key}.description`)}
                </Typography>
              </StyledGrid>
            );
          })}
        </Grid>
      </StyledContainer>
    </SectionBox>
  );
};

export default Values;

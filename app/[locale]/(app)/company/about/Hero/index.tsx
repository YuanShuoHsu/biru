import { useTranslations } from "next-intl";

import PhotoSlider from "./PhotoSlider";

import GradientBox from "@/components/GradientBox";

import {
  Container,
  type ContainerProps,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  padding: theme.spacing(5, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(5),
}));

const CenteredStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const StatsStack = styled(Stack)(({ theme }) => ({
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(5),
}));

const Hero = () => {
  const tCompanyAboutHero = useTranslations("company.about.hero");

  const STATS = [
    {
      label: tCompanyAboutHero("stats.founded.label"),
      value: tCompanyAboutHero("stats.founded.value"),
    },
    {
      label: tCompanyAboutHero("stats.ingredients.label"),
      value: tCompanyAboutHero("stats.ingredients.value"),
    },
    {
      label: tCompanyAboutHero("stats.hours.label"),
      value: tCompanyAboutHero("stats.hours.value"),
    },
  ];

  return (
    <StyledContainer component="header" disableGutters maxWidth="lg">
      <CenteredStack>
        <StyledTypography color="primary" component="h2" variant="body2">
          {tCompanyAboutHero("subtitle")}
        </StyledTypography>
        <StyledTypography align="center" component="h2" variant="h5">
          {tCompanyAboutHero("titleLine1")}
          <br />
          <GradientBox component="span">
            {tCompanyAboutHero("titleLine2")}
          </GradientBox>
        </StyledTypography>
        <Typography align="center" variant="body1">
          {tCompanyAboutHero("description")}
        </Typography>
      </CenteredStack>
      <PhotoSlider />
      <StatsStack direction="row">
        {STATS.map(({ label, value }) => (
          <CenteredStack key={label}>
            <StyledTypography color="primary" variant="h4">
              {value}
            </StyledTypography>
            <Typography color="textSecondary" variant="body1">
              {label}
            </Typography>
          </CenteredStack>
        ))}
      </StatsStack>
    </StyledContainer>
  );
};

export default Hero;

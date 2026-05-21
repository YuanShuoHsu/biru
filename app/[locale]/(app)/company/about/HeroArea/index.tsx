import { useTranslations } from "next-intl";

import PhotoSlider from "./PhotoSlider";

import GradientBox from "@/components/GradientBox";

import { Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingBlock: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const HeroArea = () => {
  const tCompanyAboutHeroArea = useTranslations("company.about.heroArea");

  const STATS = [
    {
      label: tCompanyAboutHeroArea("stats.founded.label"),
      value: tCompanyAboutHeroArea("stats.founded.value"),
    },
    {
      label: tCompanyAboutHeroArea("stats.ingredients.label"),
      value: tCompanyAboutHeroArea("stats.ingredients.value"),
    },
    {
      label: tCompanyAboutHeroArea("stats.hours.label"),
      value: tCompanyAboutHeroArea("stats.hours.value"),
    },
  ];

  return (
    <StyledContainer maxWidth="lg">
      <Stack alignItems="center" gap={2}>
        <Typography
          color="primary"
          component="h2"
          fontWeight="bold"
          variant="subtitle1"
        >
          {tCompanyAboutHeroArea("subtitle")}
        </Typography>
        <Typography
          color="text.primary"
          component="h1"
          fontWeight="bold"
          textAlign="center"
          variant="h5"
        >
          {tCompanyAboutHeroArea("titleLine1")}
          <br />
          <GradientBox component="span">
            {tCompanyAboutHeroArea("titleLine2")}
          </GradientBox>
        </Typography>
        <Typography color="text.primary" textAlign="center" variant="body1">
          {tCompanyAboutHeroArea("description")}
        </Typography>
      </Stack>
      <PhotoSlider />
      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        gap={5}
      >
        {STATS.map(({ label, value }) => (
          <Stack key={label} alignItems="center" gap={2}>
            <Typography color="primary.main" fontWeight="bold" variant="h4">
              {value}
            </Typography>
            <Typography color="text.secondary" variant="body1">
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </StyledContainer>
  );
};

export default HeroArea;

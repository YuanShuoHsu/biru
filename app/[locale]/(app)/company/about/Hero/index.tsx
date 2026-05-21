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

const Hero = () => {
  const t = useTranslations("company.about.hero");

  const STATS = [
    {
      label: t("stats.founded.label"),
      value: t("stats.founded.value"),
    },
    {
      label: t("stats.ingredients.label"),
      value: t("stats.ingredients.value"),
    },
    {
      label: t("stats.hours.label"),
      value: t("stats.hours.value"),
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
          {t("subtitle")}
        </Typography>
        <Typography
          color="text.primary"
          component="h1"
          fontWeight="bold"
          textAlign="center"
          variant="h5"
        >
          {t("titleLine1")}
          <br />
          <GradientBox component="span">
            {t("titleLine2")}
          </GradientBox>
        </Typography>
        <Typography color="text.primary" textAlign="center" variant="body1">
          {t("description")}
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

export default Hero;

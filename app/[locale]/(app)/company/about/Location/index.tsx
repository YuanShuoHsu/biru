import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import { LocationOn, Schedule } from "@mui/icons-material";
import { Box, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=REPLACE_WITH_YOUR_EMBED_URL";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledIframe = styled("iframe")(({ theme }) => ({
  width: "100%",
  height: theme.spacing(50),
  borderRadius: theme.shape.borderRadius,
}));

const Location = () => {
  const tCompanyAboutLocation = useTranslations("company.about.location");

  return (
    <Box paddingBlock={5} bgcolor="background.paper">
      <StyledContainer maxWidth="lg">
        <Typography
          color="primary.main"
          component="h2"
          fontWeight="bold"
          variant="body2"
        >
          {tCompanyAboutLocation("label")}
        </Typography>
        <Typography
          color="text.primary"
          component="h2"
          fontWeight="bold"
          variant="h5"
        >
          {tCompanyAboutLocation("titlePrefix")}
          <GradientBox component="span">
            {tCompanyAboutLocation("titleHighlight")}
          </GradientBox>
        </Typography>
        <Stack gap={1}>
          <Stack direction="row" gap={1}>
            <LocationOn color="primary" fontSize="small" />
            <Typography color="text.secondary" variant="body2">
              {tCompanyAboutLocation("address")}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1}>
            <Schedule color="primary" fontSize="small" />
            <Typography color="text.secondary" variant="body2">
              {tCompanyAboutLocation("hours")}
            </Typography>
          </Stack>
        </Stack>
        <StyledIframe
          loading="lazy"
          src={GOOGLE_MAPS_EMBED_URL}
          title={tCompanyAboutLocation("label")}
        />
      </StyledContainer>
    </Box>
  );
};

export default Location;

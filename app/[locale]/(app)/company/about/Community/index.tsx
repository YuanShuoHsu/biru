import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import { LocationOn, Schedule } from "@mui/icons-material";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=REPLACE_WITH_YOUR_EMBED_URL";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingBlock: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const MapFrame = styled("iframe")({
  width: "100%",
  height: 360,
  border: 0,
  borderRadius: 8,
  display: "block",
});

const Location = () => {
  const tCompanyAboutLocation = useTranslations("company.about.location");

  return (
    <StyledContainer maxWidth="lg">
      <Grid alignItems="center" container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack gap={2}>
            <Stack gap={1}>
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
                variant="h4"
              >
                {tCompanyAboutLocation("titlePrefix")}
                <GradientBox component="span">
                  {tCompanyAboutLocation("titleHighlight")}
                </GradientBox>
              </Typography>
            </Stack>
            <Stack gap={1.5}>
              <Stack alignItems="flex-start" direction="row" gap={1}>
                <LocationOn
                  color="primary"
                  fontSize="small"
                  sx={{ mt: 0.25 }}
                />
                <Typography color="text.secondary" variant="body2">
                  {tCompanyAboutLocation("address")}
                </Typography>
              </Stack>
              <Stack alignItems="flex-start" direction="row" gap={1}>
                <Schedule color="primary" fontSize="small" sx={{ mt: 0.25 }} />
                <Typography color="text.secondary" variant="body2">
                  {tCompanyAboutLocation("hours")}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <MapFrame
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={GOOGLE_MAPS_EMBED_URL}
              title={tCompanyAboutLocation("label")}
            />
          </Box>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Location;

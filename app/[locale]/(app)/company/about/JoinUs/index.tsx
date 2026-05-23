import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(5),
}));

const JoinUs = () => {
  const tCompanyAboutJoinUs = useTranslations("company.about.joinUs");

  return (
    <Box paddingBlock={5} bgcolor="background.paper">
      <StyledContainer maxWidth="lg">
        <Stack alignItems="center" gap={2}>
          <Typography
            color="primary.main"
            component="h2"
            fontWeight="bold"
            variant="body2"
          >
            {tCompanyAboutJoinUs("label")}
          </Typography>
          <Typography
            color="text.primary"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            variant="h5"
          >
            <GradientBox component="span">
              {tCompanyAboutJoinUs("titleLine1")}
            </GradientBox>
            <br />
            {tCompanyAboutJoinUs("titleLine2")}
          </Typography>
          <Typography color="text.secondary" textAlign="center" variant="body1">
            {tCompanyAboutJoinUs("description")}
          </Typography>
        </Stack>
        <Button
          disableElevation
          endIcon={<ArrowForward />}
          href="#team"
          variant="contained"
        >
          {tCompanyAboutJoinUs("button")}
        </Button>
        <Box
          alt={tCompanyAboutJoinUs("imageAlt")}
          component="img"
          loading="lazy"
          src="/images/IMG_4590.jpg"
          sx={{ width: "100%", borderRadius: 1 }}
        />
      </StyledContainer>
    </Box>
  );
};

export default JoinUs;

import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import { ChevronRight } from "@mui/icons-material";
import {
  Button,
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

const StyledStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const JoinUs = () => {
  const tCompanyAboutJoinUs = useTranslations("company.about.joinUs");

  return (
    <StyledContainer component="section" disableGutters maxWidth="lg">
      <StyledStack>
        <StyledTypography color="primary" component="h2" variant="body2">
          {tCompanyAboutJoinUs("label")}
        </StyledTypography>
        <StyledTypography align="center" component="h2" variant="h5">
          <GradientBox component="span">
            {tCompanyAboutJoinUs("titleLine1")}
          </GradientBox>
          <br />
          {tCompanyAboutJoinUs("titleLine2")}
        </StyledTypography>
        <Typography align="center" color="textSecondary" variant="body1">
          {tCompanyAboutJoinUs("description")}
        </Typography>
      </StyledStack>
      <Button endIcon={<ChevronRight />} href="#" variant="contained">
        {tCompanyAboutJoinUs("button")}
      </Button>
    </StyledContainer>
  );
};

export default JoinUs;

import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import { ORDER_MODE } from "@/constants/orderMode";

import { LocalMall, ReceiptLong } from "@mui/icons-material";
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
  gap: theme.spacing(3),
}));

const CenteredStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const ActionStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  justifyContent: "center",
  gap: theme.spacing(1),

  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const Hero = () => {
  const tHomeHero = useTranslations("home.hero");

  return (
    <StyledContainer component="section" disableGutters maxWidth="lg">
      <CenteredStack>
        <StyledTypography color="primary" variant="body2">
          {tHomeHero("subtitle")}
        </StyledTypography>
        <StyledTypography align="center" component="h1" variant="h5">
          {tHomeHero("titleLine1")}
          <br />
          <GradientBox component="span">{tHomeHero("titleLine2")}</GradientBox>
        </StyledTypography>
        <Typography align="center" color="textSecondary" variant="body1">
          {tHomeHero("description")}
        </Typography>
      </CenteredStack>
      <ActionStack direction={{ xs: "column", sm: "row" }}>
        <Button
          href={`/order/${ORDER_MODE.Pickup}`}
          startIcon={<LocalMall />}
          variant="contained"
        >
          {tHomeHero("pickup")}
        </Button>
        <Button
          href="/order-board"
          startIcon={<ReceiptLong />}
          variant="outlined"
        >
          {tHomeHero("orderBoard")}
        </Button>
      </ActionStack>
    </StyledContainer>
  );
};

export default Hero;

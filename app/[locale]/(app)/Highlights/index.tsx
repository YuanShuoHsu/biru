import { useTranslations } from "next-intl";

import GradientBox from "@/components/GradientBox";

import { ORDER_MODE } from "@/constants/orderMode";

import {
  ConfirmationNumber,
  HourglassTop,
  LocalMall,
  QrCodeScanner,
  ReceiptLong,
  Stars,
  type SvgIconComponent,
} from "@mui/icons-material";
import {
  Box,
  type BoxProps,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

type HighlightKey =
  | "coupons"
  | "orderBoard"
  | "pickup"
  | "points"
  | "qrOrder"
  | "waitlist";

const HIGHLIGHTS: {
  href?: string;
  icon: SvgIconComponent;
  key: HighlightKey;
}[] = [
  { href: `/order/${ORDER_MODE.Pickup}`, icon: LocalMall, key: "pickup" },
  { icon: QrCodeScanner, key: "qrOrder" },
  { icon: HourglassTop, key: "waitlist" },
  { href: "/order-board", icon: ReceiptLong, key: "orderBoard" },
  { href: "/auth/points", icon: Stars, key: "points" },
  { href: "/auth/coupons", icon: ConfirmationNumber, key: "coupons" },
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

const StyledCard = styled(Card)({
  height: "100%",

  "& .MuiCardActionArea-root": {
    height: "100%",
  },
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const TitleStack = styled(Stack)(({ theme }) => ({
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

const Highlights = () => {
  const tHomeHighlights = useTranslations("home.highlights");

  return (
    <SectionBox component="section">
      <StyledContainer disableGutters maxWidth="lg">
        <HeaderStack>
          <StyledTypography color="primary" variant="body2">
            {tHomeHighlights("subtitle")}
          </StyledTypography>
          <StyledTypography component="h2" variant="h5">
            {tHomeHighlights("titlePrefix")}
            <GradientBox component="span">
              {tHomeHighlights("titleHighlight")}
            </GradientBox>
          </StyledTypography>
          <Typography color="textSecondary" variant="body1">
            {tHomeHighlights("description")}
          </Typography>
        </HeaderStack>
        <Grid container spacing={2}>
          {HIGHLIGHTS.map(({ href, icon: Icon, key }) => {
            const content = (
              <StyledCardContent>
                <TitleStack direction="row">
                  <IconBox>
                    <Icon color="primary" fontSize="small" />
                  </IconBox>
                  <StyledTypography component="h3" variant="body2">
                    {tHomeHighlights(`items.${key}.title`)}
                  </StyledTypography>
                </TitleStack>
                <Typography color="textSecondary" variant="body2">
                  {tHomeHighlights(`items.${key}.description`)}
                </Typography>
              </StyledCardContent>
            );

            return (
              <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                <StyledCard variant="outlined">
                  {href ? (
                    <CardActionArea href={href}>{content}</CardActionArea>
                  ) : (
                    content
                  )}
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </StyledContainer>
    </SectionBox>
  );
};

export default Highlights;

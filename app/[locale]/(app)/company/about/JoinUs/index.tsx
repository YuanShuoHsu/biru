import { useTranslations } from "next-intl";
import Image from "next/image";

import GradientBox from "@/components/GradientBox";

import { CAREERS_URL } from "@/constants/company";

import { OpenInNew, PhotoLibrary } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  type ContainerProps,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { StorePhoto } from "@/types/storePhotos";

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

const PhotoBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: theme.breakpoints.values.sm,
  aspectRatio: "4/3",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  backgroundColor: theme.vars.palette.action.hover,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledPhotoLibrary = styled(PhotoLibrary)(({ theme }) => ({
  fontSize: theme.spacing(8),
}));

interface JoinUsProps {
  storePhoto?: StorePhoto;
}

const JoinUs = ({ storePhoto }: JoinUsProps) => {
  const tCompanyAboutJoinUs = useTranslations("company.about.joinUs");

  return (
    <StyledContainer component="section" disableGutters maxWidth="lg">
      <StyledStack>
        <StyledTypography color="primary" variant="body2">
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
      <PhotoBox>
        {storePhoto ? (
          <Image
            alt={storePhoto.alt}
            fill
            sizes="(min-width: 600px) 600px, 100vw"
            src={storePhoto.image}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <StyledPhotoLibrary color="disabled" />
        )}
      </PhotoBox>
      <Button
        endIcon={<OpenInNew />}
        href={CAREERS_URL}
        rel="noopener noreferrer"
        target="_blank"
        variant="contained"
      >
        {tCompanyAboutJoinUs("button")}
      </Button>
    </StyledContainer>
  );
};

export default JoinUs;

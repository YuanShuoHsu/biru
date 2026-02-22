"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useParams } from "next/navigation";

import { Box, Link as MuiLink, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { RouteParams } from "@/types/routeParams";

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: theme.spacing(4),
  height: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  flexShrink: 0,
  overflow: "hidden",
}));

interface BrandMarkProps {
  color?: TypographyProps["color"];
}

const BrandMark = ({ color }: BrandMarkProps) => {
  const { locale } = useParams<RouteParams>();

  return (
    <MuiLink
      minWidth={0}
      color="inherit"
      component={NextLink}
      href={`/${locale}`}
      display="flex"
      alignItems="center"
      gap={1}
      underline="none"
    >
      <ImageBox>
        <Image
          alt="biru coffee"
          draggable={false}
          fill
          priority
          sizes="(min-width: 808px) 50vw, 100vw"
          src="/images/IMG_4590.jpg"
          style={{ objectFit: "cover" }}
        />
      </ImageBox>
      <Typography color={color} component="span" noWrap variant="h6">
        Biru Coffee
      </Typography>
    </MuiLink>
  );
};

export default BrandMark;

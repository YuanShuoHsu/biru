"use client";

import Image from "next/image";

import { Link } from "@/i18n/navigation";

import { Box, Link as MuiLink, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

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

const BrandMark = ({ color }: BrandMarkProps) => (
  <MuiLink
    minWidth={0}
    color="inherit"
    component={Link}
    href="/"
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

export default BrandMark;

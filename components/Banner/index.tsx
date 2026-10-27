"use client";

import { Fragment } from "react";

import { useLocale, useTranslations } from "next-intl";
import { Autoplay, Mousewheel, Navigation } from "swiper/modules";

import Carousel from "@/components/Carousel";

import { Link } from "@/i18n/navigation";

import { ViewCarousel } from "@mui/icons-material";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { Banner as BannerType } from "@/types/banners";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "4/3",
  backgroundColor: theme.vars.palette.action.hover,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.up("sm")]: {
    aspectRatio: "16/9",
  },
}));

const StyledImage = styled("img")({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const StyledLink = styled(Link)({
  display: "block",
  width: "100%",
  height: "100%",
});

const StyledAnchor = styled("a")({
  display: "block",
  width: "100%",
  height: "100%",
});

const StyledViewCarousel = styled(ViewCarousel)(({ theme }) => ({
  fontSize: theme.spacing(8),
}));

interface BannerProps {
  banners: BannerType[];
}

const Banner = ({ banners }: BannerProps) => {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <StyledBox>
      {banners.length ? (
        <Carousel
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay, Mousewheel, Navigation]}
          mousewheel={{ forceToAxis: true }}
          navigation={true}
          slidesPerView={1}
          spaceBetween={0}
        >
          {banners.map(({ alt, id, image, url }, index) => {
            const slide = (
              <StyledImage
                alt={alt?.[locale] || t("banner.slide", { index: index + 1 })}
                src={image}
              />
            );

            if (url?.startsWith("/"))
              return (
                <StyledLink href={url} key={id}>
                  {slide}
                </StyledLink>
              );

            if (url?.startsWith("https://"))
              return (
                <StyledAnchor
                  href={url}
                  key={id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {slide}
                </StyledAnchor>
              );

            return <Fragment key={id}>{slide}</Fragment>;
          })}
        </Carousel>
      ) : (
        <StyledViewCarousel color="disabled" />
      )}
    </StyledBox>
  );
};

export default Banner;

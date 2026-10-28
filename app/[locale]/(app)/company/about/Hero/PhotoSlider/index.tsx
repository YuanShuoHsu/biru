"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";

import Carousel from "@/components/Carousel";

import { PhotoLibrary } from "@mui/icons-material";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { StorePhoto } from "@/types/storePhotos";

const MIN_SLIDE_COUNT = 10;

const MaskBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: theme.shape.borderRadius,

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "20%",
    pointerEvents: "none",
    zIndex: 2,
  },

  "&::before": {
    left: 0,
    background: `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
  },

  "&::after": {
    right: 0,
    background: `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
  },
}));

const PhotoBox = styled(Box)(({ theme }) => ({
  position: "relative",
  aspectRatio: "4/3",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const EmptyBox = styled(Box)(({ theme }) => ({
  width: "100%",
  aspectRatio: "4/3",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.vars.palette.action.hover,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.up("sm")]: {
    aspectRatio: "8/3",
  },

  [theme.breakpoints.up("md")]: {
    aspectRatio: "4/1",
  },

  [theme.breakpoints.up("lg")]: {
    aspectRatio: "16/3",
  },
}));

const StyledPhotoLibrary = styled(PhotoLibrary)(({ theme }) => ({
  fontSize: theme.spacing(8),
}));

interface PhotoSliderProps {
  storePhotos: StorePhoto[];
}

const PhotoSlider = ({ storePhotos }: PhotoSliderProps) => {
  if (!storePhotos.length)
    return (
      <EmptyBox>
        <StyledPhotoLibrary color="disabled" />
      </EmptyBox>
    );

  const repeat = Math.ceil(MIN_SLIDE_COUNT / storePhotos.length);
  const slides = Array.from({ length: repeat }, () => storePhotos).flat();

  return (
    <MaskBox>
      <Carousel
        autoplay={{ delay: 0, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 8 },
          600: { slidesPerView: 2, spaceBetween: 12 },
          900: { slidesPerView: 3, spaceBetween: 16 },
          1200: { slidesPerView: 4, spaceBetween: 16 },
        }}
        loop={true}
        modules={[Autoplay]}
        onSetTransition={(swiper) => {
          swiper.wrapperEl.style.transitionTimingFunction = "linear";
        }}
        pagination={false}
        spaceBetween={8}
        speed={4000}
      >
        {slides.map(({ alt, id, image }, index) => {
          const isRepeat = index >= storePhotos.length;

          return (
            <PhotoBox
              aria-hidden={isRepeat || undefined}
              key={`${id}-${index}`}
            >
              <Image
                alt={isRepeat ? "" : alt}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1200px) 288px, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
                src={image}
                style={{ objectFit: "cover" }}
              />
            </PhotoBox>
          );
        })}
      </Carousel>
    </MaskBox>
  );
};

export default PhotoSlider;

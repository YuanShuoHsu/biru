"use client";

// https://swiperjs.com/swiper-api#param-loop

import Image from "next/image";
import { Autoplay } from "swiper/modules";

import Carousel from "@/components/Carousel";

import { PhotoLibrary } from "@mui/icons-material";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { StorePhoto } from "@/types/storePhotos";

// Loop needs slidesPerView + slidesPerGroup slides at the widest breakpoint (4 + 1)
const MIN_LOOP_SLIDE_COUNT = 5;

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
  width: "100%",
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

interface PhotoSliderProps {
  storePhotos: StorePhoto[];
}

const PhotoSlider = ({ storePhotos }: PhotoSliderProps) => {
  const slides: (StorePhoto | null)[] = storePhotos.length
    ? Array.from(
        { length: Math.ceil(MIN_LOOP_SLIDE_COUNT / storePhotos.length) },
        () => storePhotos,
      ).flat()
    : Array.from({ length: MIN_LOOP_SLIDE_COUNT }, () => null);

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
        {slides.map((storePhoto, index) => {
          const isRepeat = index >= storePhotos.length;

          return (
            <PhotoBox
              aria-hidden={isRepeat || undefined}
              key={storePhoto ? `${storePhoto.id}-${index}` : index}
            >
              {storePhoto ? (
                <Image
                  alt={isRepeat ? "" : storePhoto.alt}
                  fill
                  sizes="(min-width: 1200px) 288px, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
                  src={storePhoto.image}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <StyledPhotoLibrary color="disabled" />
              )}
            </PhotoBox>
          );
        })}
      </Carousel>
    </MaskBox>
  );
};

export default PhotoSlider;

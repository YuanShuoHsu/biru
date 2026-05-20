"use client";

import Image from "next/image";
import { Autoplay, FreeMode, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { styled } from "@mui/material/styles";

import "swiper/css";
import "swiper/css/free-mode";

const SLIDE_COUNT = 10;

const StyledSwiper = styled(Swiper)({
  width: "100%",
  height: "100%",
});

const StyledSlide = styled(SwiperSlide)(({ theme }) => ({
  position: "relative",
  aspectRatio: "4/3",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const PhotoSlider = () => (
  <StyledSwiper
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    breakpoints={{
      0: { slidesPerView: 1, spaceBetween: 8 },
      600: { slidesPerView: 2, spaceBetween: 12 },
      900: { slidesPerView: 3, spaceBetween: 16 },
      1200: { slidesPerView: 4, spaceBetween: 16 },
    }}
    freeMode={{ sticky: true }}
    grabCursor
    keyboard={{ enabled: true }}
    loop
    modules={[Autoplay, FreeMode, Keyboard]}
    spaceBetween={8}
  >
    {Array.from({ length: SLIDE_COUNT }, (_, index) => (
      <StyledSlide key={index}>
        <Image
          alt={`Photo ${index + 1}`}
          fill
          priority={index < 4}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
          src="/images/IMG_4590.jpg"
          style={{ objectFit: "cover" }}
        />
      </StyledSlide>
    ))}
  </StyledSwiper>
);

export default PhotoSlider;

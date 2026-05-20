"use client";

import Image from "next/image";
import { Autoplay, FreeMode, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import "swiper/css";
import "swiper/css/free-mode";

const SLIDE_COUNT = 10;

const StyledBox = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: 4 / 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const StyledSwiper = styled(Swiper)({
  width: "100%",
  height: "100%",
});

const StyledSlide = styled(SwiperSlide)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const PhotoSlider = () => (
  <StyledBox>
    <StyledSwiper
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      freeMode={{ sticky: true }}
      grabCursor
      keyboard={{ enabled: true }}
      loop
      modules={[Autoplay, FreeMode, Keyboard]}
      slidesPerView="auto"
      spaceBetween={8}
    >
      {Array.from({ length: SLIDE_COUNT }, (_, index) => (
        <StyledSlide key={index}>
          <Image
            alt={`Photo ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 600px) 160px, 200px"
            src="/images/IMG_4590.jpg"
            style={{ objectFit: "cover" }}
          />
        </StyledSlide>
      ))}
    </StyledSwiper>
  </StyledBox>
);

export default PhotoSlider;

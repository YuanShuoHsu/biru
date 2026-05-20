"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Autoplay, FreeMode, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";

const PHOTO_COLORS = [
  "#1565c0",
  "#2e7d32",
  "#6a1b9a",
  "#ad1457",
  "#00838f",
  "#e65100",
  "#37474f",
  "#4e342e",
  "#283593",
  "#558b2f",
];

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
      {PHOTO_COLORS.map((color, index) => (
        <StyledSlide key={index}>
          <Box
            sx={{
              width: { xs: 160, sm: 200 },
              height: { xs: 120, sm: 150 },
              borderRadius: 2,
              bgcolor: color,
              opacity: 0.85,
            }}
          />
        </StyledSlide>
      ))}
    </StyledSwiper>
  </StyledBox>
);

export default PhotoSlider;

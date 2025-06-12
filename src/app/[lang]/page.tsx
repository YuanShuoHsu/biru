"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import NavigationButton from "@/components/NavigationButton";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Autoplay,
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxHeight: "calc(100vh - 48px)",
  aspectRatio: 4 / 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.up("sm")]: {
    maxHeight: "calc(100vh - 64px)",
    aspectRatio: 16 / 9,
  },
}));

const StyledSwiper = styled(Swiper)(({ theme }) => ({
  width: "100%",
  height: "100%",

  ".swiper-button-prev": {
    "&::after": {},
  },
  ".swiper-button-next": {
    "&::after": {},
  },

  ".swiper-pagination-bullet": {
    backgroundColor: theme.palette.common.white,
    opacity: 0.5,
    transition: theme.transitions.create(["width", "background-color"]),
  },
  ".swiper-pagination-bullet-active": {
    width: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledSlide = styled(SwiperSlide)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Home = () => {
  return (
    <StyledBox>
      <StyledSwiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        freeMode={{
          sticky: true,
        }}
        keyboard={{
          enabled: true,
        }}
        loop={true}
        mousewheel={true}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        spaceBetween={0}
        modules={[
          Autoplay,
          FreeMode,
          Keyboard,
          Mousewheel,
          Navigation,
          Pagination,
        ]}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <StyledSlide key={index}>
            <Image
              alt={`Slide ${index + 1}`}
              fill
              priority
              sizes="(min-width: 808px) 50vw, 100vw"
              src="/images/IMG_4590.jpg"
              style={{
                objectFit: "cover",
              }}
            />
          </StyledSlide>
        ))}
      </StyledSwiper>
      <NavigationButton direction="next" icon={ChevronRight} />
      <NavigationButton direction="prev" icon={ChevronLeft} />
    </StyledBox>
  );
};

export default Home;

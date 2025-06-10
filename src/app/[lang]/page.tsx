"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import NavigationButton from "@/components/NavigationButton";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box } from "@mui/material";

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

const Home = () => (
  <Box className="relative w-full h-[500px] flex justify-center items-center">
    <Swiper
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
      pagination={{ clickable: true }}
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
      className="w-full h-full"
    >
      {Array.from({ length: 9 }, (_, index) => (
        <SwiperSlide key={index} className="flex justify-center items-center">
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
        </SwiperSlide>
      ))}
    </Swiper>
    <NavigationButton direction="next" icon={ChevronRight} />
    <NavigationButton direction="prev" icon={ChevronLeft} />
  </Box>
);

export default Home;

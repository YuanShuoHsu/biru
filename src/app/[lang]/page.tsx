"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import Image from "next/image";
import {
  Autoplay,
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => (
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
    navigation={true}
    pagination={{ clickable: true }}
    slidesPerView={1}
    spaceBetween={0}
    modules={[Autoplay, FreeMode, Keyboard, Mousewheel, Navigation, Pagination]}
    className="w-full h-[300px] bg-amber-400"
  >
    {Array.from({ length: 9 }, (_, index) => (
      <SwiperSlide
        key={index}
        className="flex justify-center items-center text-xl bg-green-200"
      >
        Slide {index + 1}
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
);

export default Home;

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";

export default function HeroSlider() {
  const images = [
    "/one_hero_section.jpg",
    "/two_hero_section.jpg",
    "/three_hero_section.jpg",
  ];
  return (
    <div className="h-[50vh] relative">
      <Swiper navigation={true} modules={[Navigation, Autoplay]} autoplay loop className="mySwiper">
        {images?.map((src) => (
          <SwiperSlide>
            <img src={src} alt="" className="h-[400px] w-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

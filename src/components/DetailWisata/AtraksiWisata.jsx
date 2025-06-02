import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import arrowRight from "../../assets/DetailWisata/icon/arrowRight.svg";

export const AtraksiWisata = ({ atraksi = [] }) => {
  if (!atraksi.length) return null;

  return (
    <section className="py-10 px-4 sm:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="md:text-[26px] sm:text-2xl text-body font-bold my-6 mb-4">
          Atraksi Wisata
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-next",
              prevEl: ".swiper-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="group"
          >
            {atraksi.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="relative w-full h-[350px] bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${item.gambar || " "})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl" />
                  <p className="md:text-2xl sm:text-xl text-normal absolute bottom-4 left-4 right-4 text-white font-semibold z-10">
                    {item.nama}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigasi kustom */}
          <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 rounded-full z-10">
            <img src={arrowRight} alt="Left" className="w-8 h-8 rotate-180" />
          </button>
          <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-10">
            <img src={arrowRight} alt="Right" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

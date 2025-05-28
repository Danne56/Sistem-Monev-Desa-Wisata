import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import arrowRight from "../../assets/DetailWisata/icon/arrowRight.svg";

export const PaketWisata = ({ paketWisata = [] }) => {
  if (!paketWisata.length) return null;

  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  return (
    <section className="py-10 px-4 sm:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="md:text-[26px] sm:text-2xl text-body font-bold my-6 mb-4">
          Paket Wisata
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".paketWisata-next",
              prevEl: ".paketWisata-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {paketWisata.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={item.gambar || ""}
                    alt={item.nama}
                    className="w-full h-[220px] object-cover rounded-xl"
                  />
                  <div className="mt-2">
                    <p className="md:text-xl sm:text-[18px] text-normal font-bold truncate">
                      {item.nama}
                    </p>
                    <p className="md:text-2xl sm:text-xl text-[18px] text-green-700 font-extrabold">
                      {formatPrice(item.harga)}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="paketWisata-prev absolute left-0 top-1/2 -translate-y-1/2 rounded-full z-10">
            <img src={arrowRight} alt="left" className="w-8 h-8 rotate-180" />
          </button>

          <button className="paketWisata-next absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-10">
            <img src={arrowRight} alt="right" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

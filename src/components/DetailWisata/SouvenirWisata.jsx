import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import souvenir from "../../assets/DetailWisata/souvenir.webp";
import arrowRight from "../../assets/DetailWisata/icon/arrowRight.svg";

const dummySouvenir = [
  { name: "Aneka Olahan Produk Griya Cokelat", price: "Rp15.000" },
  { name: "Milky Chocolate", price: "Rp35.000" },
  { name: "Minuman Cokelat Chocomix", price: "Rp30.000" },
  { name: "Cokelat Batangan Premium", price: "Rp25.000" },
  { name: "Kopi Cokelat Gula Aren", price: "Rp28.000" },
];

export const SouvenirWisata = () => {
  return (
    <section className="py-10 px-4 sm:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="md:text-[26px] sm:text-2xl text-body font-bold my-6 mb-4">Souvenir</h2>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".souvenir-next",
              prevEl: ".souvenir-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {dummySouvenir.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <img src={souvenir} alt={item.name} className="w-full h-[220px] object-cover rounded-xl" />
                  <div className="mt-2">
                    <p className="md:text-xl sm:text-[18px] text-normal font-bold truncate">{item.name}</p>
                    <p className="md:text-2xl sm:text-xl text-[18px] text-green-700 font-extrabold">{item.price}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="souvenir-prev absolute left-0 top-1/2 -translate-y-1/2  rounded-full z-10">
            <img src={arrowRight} alt="left" className="w-8 h-8 rotate-180" />
          </button>

          <button className="souvenir-next absolute right-0 top-1/2 -translate-y-1/2  rounded-full z-10">
            <img src={arrowRight} alt="right" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

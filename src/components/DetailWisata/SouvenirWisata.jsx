import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import arrowRight from "../../assets/DetailWisata/icon/arrowRight.svg";

const placeholderImage = "https://picsum.photos/id/30/400/220";

export const SouvenirWisata = ({ souvenir }) => {
  const validSouvenir = Array.isArray(souvenir) ? souvenir.filter(Boolean) : [];
  const isEmpty = validSouvenir.length === 0;

  return (
    <section className="py-10 px-4 sm:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="md:text-[26px] sm:text-2xl text-body font-bold my-6 mb-4">
          Souvenir
        </h2>

        {isEmpty ? (
          <div className="text-gray-600 text-center py-10">
            <img
              src={placeholderImage}
              alt="Placeholder"
              className="w-full max-w-md h-[220px] object-cover rounded-xl mx-auto  opacity-60"
            />
            <p className="text-lg">Belum ada souvenir tersedia</p>
          </div>
        ) : (
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
              {validSouvenir.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="rounded-xl overflow-hidden shadow-sm bg-white">
                    <img
                      src={item.gambar || placeholderImage}
                      alt={item.nama || `Souvenir ${idx + 1}`}
                      className="w-full h-[220px] object-cover rounded-xl"
                    />
                    <div className="mt-2">
                      <p className="md:text-xl sm:text-[18px] text-normal font-bold truncate">
                        {item.nama || "Souvenir"}
                      </p>
                      <p className="md:text-2xl sm:text-xl text-[18px] text-green-700 font-extrabold">
                        {item.harga ? `Rp.${item.harga}` : "-"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="souvenir-prev absolute left-0 top-1/2 -translate-y-1/2 rounded-full z-10">
              <img src={arrowRight} alt="left" className="w-8 h-8 rotate-180" />
            </button>

            <button className="souvenir-next absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-10">
              <img src={arrowRight} alt="right" className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

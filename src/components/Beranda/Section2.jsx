import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import location from "../../assets/Beranda/location.svg";
import arrowLeft from "../../assets/Beranda/arrowLeft.svg";
import arrowRight from "../../assets/Beranda/arrowRight.svg";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";

export const Section2 = () => {
  const [wisataData, setWisataData] = useState([]);

  useEffect(() => {
    // Fetch data dari API
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/atraksi-wisata");
        const result = response.data.data;

        setWisataData(result);
      } catch (error) {
        console.error("Error fetching atraksi wisata:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="atraksiWisata bg-greenMain mt-16 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-3xl font-bold">Atraksi Wisata</h2>
          <div className="flex gap-2">
            <div className="swiper-button-prev-custom cursor-pointer w-10 h-10 rounded-full border border-white flex items-center justify-center">
              <img src={arrowLeft} alt="Previous" />
            </div>
            <div className="swiper-button-next-custom cursor-pointer w-10 h-10 rounded-full border border-white flex items-center justify-center">
              <img src={arrowRight} alt="Next" />
            </div>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {wisataData.length > 0 ? (
            wisataData.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/detail/${item.slug}`}>
                  <div className="bg-[#08500D] rounded-2xl overflow-hidden shadow-md">
                    <img src={item.atraksi[0].gambar} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-base text-white">{item.atraksi[0].nama}</h3>
                      <div className="flex items-center gap-2 text-sm text-white mt-1">
                        <img src={location} alt="location" className="w-4 h-4" />
                        <span>
                          {item.kabupaten}, {item.nama_popular}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="text-center text-white py-10">Tidak ada atraksi wisata ditemukan.</div>
            </SwiperSlide>
          )}
        </Swiper>

        <Link to="/atraksi" className="flex justify-center mt-6">
          <button className="bg-white text-greenMain font-semibold px-6 py-2 rounded-full shadow hover:opacity-90 transition">Jelajahi Atraksi Lainnya</button>
        </Link>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from "react";
import DewitaMandiri from "../../assets/Beranda/DewitaMandiri.webp";
import arrowGreenRight from "../../assets/Beranda/arrowGreenRight.svg";
import arrowGreenLeft from "../../assets/Beranda/arrowGreenLeft.svg";
import timerIcon from "../../assets/Beranda/timerIcon.svg";

const beritaData = [
  {
    title: "Desa Wisata Lorem Ipsum Naik Menjadi Kategori Mandiri",
    date: "25 Mar 2025",
    image: DewitaMandiri,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Desa Wisata Contoh Meraih Penghargaan Nasional",
    date: "24 Mar 2025",
    image: DewitaMandiri,
    content: "Desa ini berhasil menjadi teladan nasional dengan pengelolaan yang ramah lingkungan dan partisipatif.",
  },
  {
    title: "Program Pemberdayaan Ekonomi Desa Diluncurkan",
    date: "23 Mar 2025",
    image: DewitaMandiri,
    content: "Kegiatan ini membantu UMKM lokal berkembang melalui pelatihan dan akses pasar digital.",
  },
  {
    title: "Program Pemberdayaan Ekonomi Desa Diluncurkan",
    date: "23 Mar 2025",
    image: DewitaMandiri,
    content: "Kegiatan ini membantu UMKM lokal berkembang melalui pelatihan dan akses pasar digital.",
  },
  {
    title: "Inovasi Digital Desa Menuju Smart Village",
    date: "22 Mar 2025",
    image: DewitaMandiri,
    content: "Penerapan aplikasi untuk layanan publik dan promosi pariwisata digital di desa.",
  },
];

export const Section4 = () => {
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(window.innerWidth >= 768 ? 3 : 1);
    };
    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + beritaData.length) % beritaData.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % beritaData.length);
  };

  const visibleCards = [];
  for (let i = 0; i < cardsPerView; i++) {
    visibleCards.push(beritaData[(index + i) % beritaData.length]);
  }

  return (
    <section className="bg-[#EBFFF5] px-4 md:px-16 py-28 overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 max-w-7xl mx-auto">Kabar Desa Wisata</h2>

      <div className="relative flex items-center ">
        {/* Left Arrow */}
        <button onClick={handlePrev} className="hidden md:flex items-center justify-center ml-[80px] z-10">
          <img src={arrowGreenLeft} alt="left" className="w-10 h-10" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden max-w-7xl mx-auto">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${index * (100 / cardsPerView)}%)` }}>
            {beritaData.map((item, i) => (
              <div key={i} className="min-w-full md:min-w-[33.3333%] px-2 box-border">
                <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-[400px]">
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <img src={timerIcon} alt="time" className="w-4 h-4 mr-2" />
                      {item.date}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button onClick={handleNext} className="hidden md:flex items-center justify-center mr-[80px] z-10">
          <img src={arrowGreenRight} alt="right" className="w-10 h-10" />
        </button>
      </div>

      {/* Mobile Arrows */}
      <div className="flex md:hidden justify-center gap-4 mt-6">
        <button onClick={handlePrev}>
          <img src={arrowGreenLeft} alt="left" className="w-10 h-10" />
        </button>
        <button onClick={handleNext}>
          <img src={arrowGreenRight} alt="right" className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
};

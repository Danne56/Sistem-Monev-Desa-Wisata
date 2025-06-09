import React, { useEffect, useState } from "react";
import heroPic from "../../assets/Beranda/heroPic.webp";
import arrow_outward from "../../assets/Beranda/arrow_outward.svg";
import arrowRight from "../../assets/LandingPage/icon/arrowRight.svg";
import arrowLeft from "../../assets/LandingPage/icon/arrowLeft.svg";
import location from "../../assets/LandingPage/icon/location.svg";
import heroPic2 from "../../assets/Beranda/nganggring.jpg";

import { Link } from "react-router-dom";

// Data dummy desa
const desaList = [
  {
    image: heroPic,
    title: "Desa Wisata Penglipuran",
    location: "Kabupaten Bangli, Bali",
  },
  {
    image: heroPic2,
    title: "Desa Wisata Nganggring",
    location: "Kabupaten Sleman, DIY",
  },
  {
    image: heroPic,
    title: "Desa Wisata Nglanggeran",
    location: "Kabupaten Gunungkidul, DIY",
  },
  {
    image: heroPic2,
    title: "Desa Wisata Nganggring",
    location: "Kabupaten Sleman, DIY",
  },
  {
    image: heroPic,
    title: "Desa Wisata Tamansari",
    location: "Kabupaten Banyuwangi, Jawa Timur",
  },
];

export const HeroLandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // mulai transisi
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % desaList.length);
        setFade(true); // aktifkan transisi setelah ganti
      }, 200); // delay kecil untuk fade-out
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + desaList.length) % desaList.length);
      setFade(true);
    }, 200);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % desaList.length);
      setFade(true);
    }, 200);
  };

  const desa = desaList[activeIndex];

  return (
    <section className="relative w-full h-[850px] sm:h-screen overflow-hidden pt-28">
      {/* Background image + fade */}
      <div className={`absolute inset-0 bg-center bg-cover transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${desa.image})` }} />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Konten */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-10 text-white text-center">
        {/* Lokasi kanan atas */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 flex items-center gap-2 z-20">
          <img src={location} alt="location" />
          <span className="text-white tracking-widest font-light text-sm sm:text-base">{desa.location.toUpperCase()}</span>
        </div>

        {/* Konten tengah */}
        <div className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}>
          <p className="text-sm md:text-base tracking-widest mb-2">— JEJARING DESA WISATA</p>
          <h1 className="text-[36px] sm:text-[48px] md:text-[56px] xl:text-[68px] font-extrabold leading-tight max-w-[900px] mx-auto">
            Membangun Indonesia <br /> Dari Desa Wisata
          </h1>
          <p className="mt-5 max-w-[900px] mx-auto text-[15px] sm:text-base md:text-lg leading-normal text-gray-200">
            Inovasi dan adaptasi masyarakat desa membuka ruang untuk berkarya, menciptakan lapangan kerja serta mempersiapkan desa wisata lebih mendunia melalui pariwisata dan ekonomi kreatif. Menyajikan pilihan bagi wisatawan untuk
            menikmati alam terbuka, sembari merasakan pengalaman berwisata di tengah kehidupan masyarakat pedesaan.
          </p>
          <Link to="/home">
            <button className="mt-8 flex items-center gap-2 border border-white px-6 py-3 rounded-full mx-auto">
              <span className="text-white text-base sm:text-lg">Masuk Monev</span>
              <img src={arrow_outward} alt="arrow" />
            </button>
          </Link>
        </div>
      </div>

      {/* Navigasi bawah */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <div className="cursor-pointer" onClick={handlePrev}>
          <img src={arrowLeft} alt="prev" />
        </div>
        <h2 className="text-white tracking-widest md:min-w-[450px] text-base sm:text-lg md:text-xl font-light text-center">{desa.title}</h2>
        <div className="cursor-pointer" onClick={handleNext}>
          <img src={arrowRight} alt="next" />
        </div>
      </div>
    </section>
  );
};

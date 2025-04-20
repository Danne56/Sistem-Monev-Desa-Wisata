import React, { useState } from "react";
import location from "../../assets/DetailWisata/icon/location.svg";
import musholla from "../../assets/DetailWisata/icon/mosque.svg";
import arealParkir from "../../assets/DetailWisata/icon/parkirArea.svg";
import spotFoto from "../../assets/DetailWisata/icon/spotFoto.svg";
import selfieArea from "../../assets/DetailWisata/icon/selfieArea.svg";
import jungleTracking from "../../assets/DetailWisata/icon/jungleTracking.svg";
import kamarMandi from "../../assets/DetailWisata/icon/toilet.svg";

export const InformasiWisata = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="mb-28 py-10 px-4 lg:px-20 max-w-7xl mx-auto">
      {/* Judul & Lokasi */}
      <h2 className="md:text-5xl sm:text-4xl text-3xl font-bold mb-2">Desa Wisata Nglanggeran</h2>
      <div className="flex items-center text-gray-600 md:text-normal text-sm mb-4">
        <img src={location} alt="lokasi" className="w-4 h-4 mr-1" />
        Nglanggeran, Patuk, Kabupaten Gunungkidul, DI Yogyakarta
      </div>

      {/* Deskripsi */}
      <p className="text-gray-700 mb-2 lg:text-[18px] md:text-normal text-[15px]">
        Desa Wisata Nglanggeran merupakan salah satu Desa Wisata Terbaik ASEAN tahun 2017 dengan konsep CBT (Community Based Tourism). Berada di Kecamatan Patuk, Kabupaten Gunungkidul, D.I.Yogyakarta. Memiliki jarak tempuh sekitar 25 KM
        dari kota Yogyakarta atau sekitar 1 jam perjalanan menggunakan mobil. Mayoritas masyarakat di Desa Wisata Nglanggeran adalah petani, pekebun dan juga peternak.
        {showMore && <> Memiliki jarak tempuh sekitar 25 KM dari kota Yogyakarta atau sekitar 1 jam perjalanan menggunakan mobil. Mayoritas masyarakat di Desa Wisata Nglanggeran adalah petani, pekebun dan juga peternak.</>}
      </p>
      <button className="text-blue-500  mb-6  md:text-normal text-[15px]" onClick={() => setShowMore(!showMore)}>
        {showMore ? "Tutup" : "Baca lebih"} {showMore ? "▲" : "▼"}
      </button>

      {/* Fasilitas */}
      <h3 className="md:text-[26px] sm:text-2xl text-body font-bold my-6">Fasilitas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10 text-gray-800 md:text-normal text-[15px]">
        <div className="flex items-center gap-2">
          <img src={arealParkir} alt="icon" className="w-7" />
          Areal Parkir
        </div>
        <div className="flex items-center gap-2">
          <img src={jungleTracking} alt="icon" className="w-7" />
          Jungle Tracking
        </div>
        <div className="flex items-center gap-2">
          <img src={kamarMandi} alt="icon" className="w-7" />
          Kamar Mandi Umum
        </div>
        <div className="flex items-center gap-2">
          <img src={musholla} alt="icon" className="w-7" />
          Mushola
        </div>
        <div className="flex items-center gap-2">
          <img src={selfieArea} alt="icon" className="w-7" />
          Selfie Area
        </div>
        <div className="flex items-center gap-2">
          <img src={spotFoto} alt="icon" className="w-7" />
          Spot Foto
        </div>
      </div>

      {/* Video */}
      <h3 className="md:text-[26px] sm:text-2xl text-body font-bold my-6">Video</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-video w-full rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/nARILw6XND8?si=gFErdPFIWSSuKRZ0"
            title="Atraksi Wisata di Desa Wisata Nglanggeran"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="aspect-video w-full rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/nARILw6XND8?si=gFErdPFIWSSuKRZ0"
            title="Atraksi Wisata di Desa Wisata Nglanggeran"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

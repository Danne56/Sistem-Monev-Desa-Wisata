import React from "react";
import unwto from "../../assets/LandingPage/unwto.png";
import kabGunungKidul from "../../assets/LandingPage/kabGunungKidul.png";
import medalStarIcon from "../../assets/LandingPage/icon/medalStarIcon.svg";

export const SectionSatu = () => {
  return (
    <section className="px-6 py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto flex lg:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1">
          <p className="text-green-700 text-sm font-semibold mb-2 uppercase tracking-wider">Menjadi Juara Tingkat Dunia</p>
          <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold mb-4 leading-tight">
            Pemenang UNWTO <br className="hidden md:block" /> Best Tourism Villages
          </h2>
          <p className="text-gray-600 mb-6">Dengan bangga mempersembahkan desa wisata yang juara di UNWTO (World Tourism Organization) Best Tourism Villages:</p>

          {/* List Juara */}
          <div className="flex flex-col gap-4 mb-6">
            {[
              { nama: "Desa Wisata Nglanggeran", tahun: "2021" },
              { nama: "Desa Wisata Penglipuran", tahun: "2023" },
              { nama: "Desa Wisata Jatiluwih", tahun: "2024" },
              { nama: "Desa Wisata Wukirsari", tahun: "2024" },
            ].map((desa, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-700 rounded-full flex items-center justify-center">
                  <img src={medalStarIcon} alt="medal icon" className="h-6 w-6" />
                </div>
                <div className="text-green-700 font-semibold">
                  {desa.nama} ({desa.tahun})
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <button className="mt-4 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-6 py-2 rounded-full transition duration-300">Selengkapnya</button>
        </div>

        {/* Right Content */}
        <div className="flex-1 relative w-full hidden md:flex justify-end">
          {/* Wrapper untuk atur ukuran gambar */}
          <div className="relative w-[75%]">
            <img src={kabGunungKidul} alt="Kabupaten Gunungkidul" className="rounded-lg max-h-[670px] w-full object-cover" />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>

            {/* Text on top of image */}
            <div className="absolute top-5 right-5 text-white text-xs md:text-sm font-semibold text-right z-10">
              <p>DESA WISATA NGLANGGERAN</p>
              <p>KABUPATEN GUNUNGKIDUL</p>
              <div className="h-0.5 w-6 bg-white mt-2 ml-auto"></div>
            </div>
          </div>

          {/* Small image overlapping to left */}
          <img src={unwto} alt="UNWTO" className="absolute left-10 bottom-10 w-44 md:w-48 rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
};

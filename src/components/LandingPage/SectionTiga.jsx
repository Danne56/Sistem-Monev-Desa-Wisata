import React from "react";
import fotoKanan from "../../assets/Beranda/fotoKanan.png";
import appStoreDownload from "../../assets/Beranda/appStoreDownload.svg";
import playStoreDownload from "../../assets/Beranda/playStoreDownload.svg";

export const SectionTiga = () => {
  return (
    <section className="mt-12 xl:py-16 lg:py-14 md:py-10 sm:py-8 p-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            Monitor, evaluasi, dan <br />
            optimasi desa wisata <br />
            <span className="text-gray-900">Anda dalam satu aplikasi</span>
          </h2>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">Aplikasi Monev memudahkan Anda dalam memonitor, mengoptimasi, dan mengevaluasi performa desa wisata anda. Download sekarang dan tingkatkan pengunjung desa wisata Anda!</p>
          <div className="flex flex-wrap justify-center md:justify-start mt-6 gap-4">
            <img src={playStoreDownload} alt="Download di Google Play" className="h-12 sm:h-14 cursor-pointer" />
            <img src={appStoreDownload} alt="Download di App Store" className="h-12 sm:h-14 cursor-pointer" />
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img src={fotoKanan} alt="Mockup Aplikasi" className="w-[250px] sm:w-[280px] md:w-[300px] lg:w-[340px] object-contain" />
        </div>
      </div>
    </section>
  );
};

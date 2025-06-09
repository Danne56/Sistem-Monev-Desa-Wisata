import React from "react";
import appStoreDownload from "../../assets/LandingPage/appStoreDownload.svg";
import playStoreDownload from "../../assets/LandingPage/playStoreDownload.svg";
import gambarKanan from "../../assets/LandingPage/gambarKanan.png"; // pastikan ini adalah gambar HP yang Anda gunakan

export const SectionLima = () => {
  return (
    <section className="bg-green-700 rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-12 text-white overflow-hidden my-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-10 md:py-14 lg:py-16 gap-8">
        {/* Kiri */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug mb-4">
            Monitoring desa wisata <br />
            di aplikasi Monev
          </h2>
          <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md">
            Monitor, evaluasi, dan optimasi desa wisata Anda <br />
            dalam satu aplikasi. Download aplikasinya sekarang!
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#">
              <img src={playStoreDownload} alt="Download on Google Play" className="h-12 md:h-14" />
            </a>
            <a href="#">
              <img src={appStoreDownload} alt="Download on the App Store" className="h-12 md:h-14" />
            </a>
          </div>
        </div>

        {/* Kanan */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img src={gambarKanan} alt="Gambar aplikasi" className="md:-mb-80 sm:-mb-72 -mb-36 drop-shadow-xl " />
        </div>
      </div>
    </section>
  );
};

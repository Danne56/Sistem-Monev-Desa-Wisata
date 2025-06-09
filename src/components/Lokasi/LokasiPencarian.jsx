import React, { useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../config";

export const LaporanPencarian = ({ wisataData }) => {
  console.log(wisataData);
  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Hasil Pencarian</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisataData?.map(
            (item) =>
              item.gambar_cover && (
                <div key={item.slug} className="relative rounded-xl overflow-hidden shadow-md group">
                  <img src={item.gambar_cover} alt={item.nama_popular} className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col p-4">
                    <h3 className="text-white font-semibold text-lg">{item.nama_popular}</h3>
                    <div className="flex items-center gap-2 text-white text-sm mt-1">
                      <span>{item.kabupaten}</span>
                    </div>
                  </div>
                  {/* Tautan ke halaman detail */}
                  <a href={`/detail/${item.slug}`} className="absolute inset-0"></a>
                </div>
              )
          )}
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button className="bg-[#135D36] text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition">Muat Lebih</button>
        </div>
      </div>
    </section>
  );
};

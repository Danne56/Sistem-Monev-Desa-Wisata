import React from "react";
import location from "../../assets/Beranda/location.svg";

import { Link } from "react-router-dom";

export const AtraksiPencarian = ({ atraksiData }) => {
  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Hasil Pencarian</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {atraksiData?.map((item, index) => (
            <Link to={`/detail/${item.slug}`}>
              <div key={index} className="relative rounded-xl overflow-hidden shadow-md group">
                <img src={item.atraksi[0].gambar} alt={item.title} className="w-full h-[320px] object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col  p-4">
                  <h3 className="text-white font-semibold text-lg">{item.atraksi[0].nama}</h3>
                  <div className="flex items-center gap-2 text-white text-sm mt-1">
                    <img src={location} alt="location" className="w-4 h-4" />
                    <h3 className="font-semibold text-base text-white">{item.atraksi.nama}</h3>
                    <span>
                      {" "}
                      {item.kabupaten}, {item.nama_popular}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button className="bg-[#135D36] text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition">Muat Lebih</button>
        </div>
      </div>
    </section>
  );
};

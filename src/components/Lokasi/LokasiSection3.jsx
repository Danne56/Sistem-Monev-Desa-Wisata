import React, { useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../config";

export const LokasiSection3 = () => {
  const [wisataData, setWisataData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/desa-wisata/details");
        console.log(response);
        if (response.data.status === "success") {
          setWisataData(response.data.data);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Jelajahi Desa Wisata</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisataData.map(
            (item) =>
              item.gambar_cover && (
                <div key={item.kd_desa} className="relative rounded-xl overflow-hidden shadow-md group">
                  <img src={item.gambar_cover} alt={item.nama_popular} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col p-4">
                    <h3 className="text-white font-semibold text-lg">{item.nama_popular}</h3>
                    <div className="flex items-center gap-2 text-white text-sm mt-1">
                      <span>{item.kabupaten}</span>
                    </div>
                  </div>
                  {/* Tautan ke halaman detail */}
                  <a href={`/detail/${item.kd_desa}`} className="absolute inset-0"></a>
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

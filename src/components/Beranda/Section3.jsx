import React, { useState, useEffect } from "react";
import location from "../../assets/Beranda/location.svg";
import { Link, Links } from "react-router-dom";
import { axiosInstance } from "../../config";

export const Section3 = () => {
  const [selectedCategory, setSelectedCategory] = useState("Wisata Alam");
  const [wisataData, setWisataData] = useState({
    "Wisata Alam": [],
    "Wisata Budaya": [],
    "Wisata Buatan": [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/desa-wisata/details?byJenis=true`);
        const result = response.data.data;
        console.log(result);

        // Filter data berdasarkan jenis_desa
        const alamData = result.filter((item) => item.jenis_desa?.includes("alam"));
        const budayaData = result.filter((item) => item.jenis_desa?.includes("budaya"));
        const buatanData = result.filter((item) => item.jenis_desa?.includes("buatan"));

        setWisataData({
          "Wisata Alam": alamData,
          "Wisata Budaya": budayaData,
          "Wisata Buatan": buatanData,
        });
      } catch (err) {
        console.error("Error fetching desa wisata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Memuat data desa wisata...</div>;
  }

  return (
    <section className="mt-16 px-4 md:px-16 py-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Jelajahi Desa Wisata</h2>

        {/* Category Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-300">
          {Object.keys(wisataData).map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`pb-2 font-medium transition-all ${selectedCategory === cat ? "border-b-2 border-green-700 text-black" : "text-gray-500"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisataData[selectedCategory].length > 0 ? (
            wisataData[selectedCategory].map((item, index) => (
              <Link to={`/detail/${item.slug}`}>
                <div key={`${item.kd_desa}-${index}`} className="relative rounded-xl overflow-hidden shadow-md group">
                  <img
                    src={item.gambar_cover || ""}
                    alt={item.nama_popular}
                    onError={(e) => {
                      e.target.src = require("../../assets/Beranda/placeholder.jpg"); // fallback image
                    }}
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col p-4">
                    <h3 className="text-white font-semibold text-lg">{item.nama_popular}</h3>
                    <div className="flex items-center gap-2 text-white text-sm mt-1">
                      <img src={location} alt="location" className="w-4 h-4" />
                      <span>{`${item.kabupaten}, ${item.provinsi}`}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Tidak ada desa wisata ditemukan untuk kategori ini.</p>
          )}
        </div>

        {/* Button */}
        <Link to="/lokasi" className="mt-10 flex justify-center">
          <button className="bg-[#135D36] text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition">Jelajahi Desa Wisata Lainnya</button>
        </Link>
      </div>
    </section>
  );
};

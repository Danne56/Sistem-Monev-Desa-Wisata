import React, { useState } from "react";
import location from "../../assets/Beranda/location.svg";
import DewiSinta from "../../assets/Beranda/DewiSinta.png";
import GoaCemara from "../../assets/Beranda/GoaCemara.png";
import Nglanggeran from "../../assets/Beranda/Nglanggeran.png";

const wisataData = {
  "Wisata Alam": [
    { title: "Desa Wisata Dewi Sinta", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Wisata Nglanggeran", location: "Kabupaten Gunungkidul", image: Nglanggeran },
    { title: "Desa Wisata Goa Cemara", location: "Kabupaten Gunungkidul", image: GoaCemara },
    { title: "Desa Wisata Dewi Sinta", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Wisata Nglanggeran", location: "Kabupaten Gunungkidul", image: Nglanggeran },
    { title: "Desa Wisata Goa Cemara", location: "Kabupaten Gunungkidul", image: GoaCemara },
  ],
  "Wisata Budaya": [
    { title: "Desa Budaya Batik", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Budaya Batik", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Tari Tradisional", location: "Kabupaten Sleman", image: Nglanggeran },
    { title: "Desa Adat Imogiri", location: "Kabupaten Bantul", image: GoaCemara },
    { title: "Desa Adat Imogiri", location: "Kabupaten Bantul", image: GoaCemara },
  ],
  "Wisata Buatan": [
    { title: "Kampung Wisata Kreatif", location: "Kota Yogyakarta", image: Nglanggeran },
    { title: "Taman Pintar", location: "Kota Yogyakarta", image: DewiSinta },
    { title: "Taman Pintar", location: "Kota Yogyakarta", image: DewiSinta },
    { title: "Desa Wisata Edukasi", location: "Kabupaten Sleman", image: GoaCemara },
    { title: "Desa Wisata Edukasi", location: "Kabupaten Sleman", image: GoaCemara },
  ],
};

export const Section3 = () => {
  const [selectedCategory, setSelectedCategory] = useState("Wisata Alam");

  const categories = Object.keys(wisataData);

  return (
    <section className="mt-16 px-4 md:px-16 py-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Jelajahi Desa Wisata</h2>

        {/* Category Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-300">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`pb-2 font-medium transition-all ${selectedCategory === cat ? "border-b-2 border-green-700 text-black" : "text-gray-500"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisataData[selectedCategory].map((item, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden shadow-md group">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col  p-4">
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                <div className="flex items-center gap-2 text-white text-sm mt-1">
                  <img src={location} alt="location" className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button className="bg-[#135D36] text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition">Jelajahi Desa Wisata Lainnya</button>
        </div>
      </div>
    </section>
  );
};

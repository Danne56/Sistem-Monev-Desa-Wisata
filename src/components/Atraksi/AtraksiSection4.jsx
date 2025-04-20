import React from "react";
import location from "../../assets/Beranda/location.svg";
import DewiSinta from "../../assets/Beranda/DewiSinta.png";
import GoaCemara from "../../assets/Beranda/GoaCemara.png";
import Nglanggeran from "../../assets/Beranda/Nglanggeran.png";

export const AtraksiSection4 = () => {
  const wisataData = [
    { title: "Desa Wisata Dewi Sinta", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Wisata Nglanggeran", location: "Kabupaten Gunungkidul", image: Nglanggeran },
    { title: "Desa Wisata Goa Cemara", location: "Kabupaten Gunungkidul", image: GoaCemara },
    { title: "Desa Wisata Dewi Sinta", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Wisata Nglanggeran", location: "Kabupaten Gunungkidul", image: Nglanggeran },
    { title: "Desa Wisata Goa Cemara", location: "Kabupaten Gunungkidul", image: GoaCemara },
    { title: "Desa Budaya Batik", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Budaya Batik", location: "Kabupaten Bantul", image: DewiSinta },
    { title: "Desa Tari Tradisional", location: "Kabupaten Sleman", image: Nglanggeran },
    { title: "Desa Adat Imogiri", location: "Kabupaten Bantul", image: GoaCemara },
    { title: "Desa Adat Imogiri", location: "Kabupaten Bantul", image: GoaCemara },
    { title: "Kampung Wisata Kreatif", location: "Kota Yogyakarta", image: Nglanggeran },
    { title: "Taman Pintar", location: "Kota Yogyakarta", image: DewiSinta },
    { title: "Taman Pintar", location: "Kota Yogyakarta", image: DewiSinta },
    { title: "Desa Wisata Edukasi", location: "Kabupaten Sleman", image: GoaCemara },
    { title: "Desa Wisata Edukasi", location: "Kabupaten Sleman", image: GoaCemara },
    { title: "Desa Wisata Edukasi", location: "Kabupaten Sleman", image: GoaCemara },
    { title: "Desa Wisata Edukasi", location: "Kabupaten Sleman", image: GoaCemara },
  ];

  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Jelajahi Atraksi Desa Wisata</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wisataData.map((item, index) => (
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
          <button className="bg-[#135D36] text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition">Muat Lebih</button>
        </div>
      </div>
    </section>
  );
};

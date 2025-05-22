import React from "react";
import acehWisata from "../../assets/Lokasi/ProvinsiWisata/acehWisata.webp";
import baliWisata from "../../assets/Lokasi/ProvinsiWisata/baliWisata.webp";
import diyWisata from "../../assets/Lokasi/ProvinsiWisata/diyWisata.webp";
import jabarWisata from "../../assets/Lokasi/ProvinsiWisata/jabarWisata.webp";
import jatengWisata from "../../assets/Lokasi/ProvinsiWisata/jatengWisata.webp";
import jatimWisata from "../../assets/Lokasi/ProvinsiWisata/jatimWisata.webp";
import nttWisata from "../../assets/Lokasi/ProvinsiWisata/nttWisata.webp";
import papuaWisata from "../../assets/Lokasi/ProvinsiWisata/papuaWisata.webp";
import sumbarWisata from "../../assets/Lokasi/ProvinsiWisata/sumbarWisata.webp";

const Card = ({ image, label, span }) => (
  <div
    className={`relative rounded-xl overflow-hidden h-[250px] bg-cover bg-center 
                ${span} w-full`}
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="absolute inset-0 bg-black/30" />
    <div className="absolute bottom-0 left-0 p-4 z-10 text-white font-medium text-sm sm:text-base">{label}</div>
  </div>
);

export const LokasiSection1 = () => {
  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Provinsi Desa Wisata Populer</h2>

        <div className="space-y-5">
          {/* Baris 1 */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5">
            <Card image={diyWisata} label="Daerah Istimewa Yogyakarta" span="md:col-span-2" />
            <Card image={jatimWisata} label="Jawa Timur" span="md:col-span-2" />
            <Card image={baliWisata} label="Bali" span="md:col-span-5" />
          </div>

          {/* Baris 2 */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5">
            <Card image={jatengWisata} label="Jawa Tengah" span="md:col-span-5" />
            <Card image={nttWisata} label="Nusa Tenggara Timur" span="md:col-span-2" />
            <Card image={sumbarWisata} label="Sumatra Barat" span="md:col-span-2" />
          </div>

          {/* Baris 3 */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5">
            <Card image={acehWisata} label="Aceh" span="md:col-span-2" />
            <Card image={jabarWisata} label="Jawa Barat" span="md:col-span-2" />
            <Card image={papuaWisata} label="Papua" span="md:col-span-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

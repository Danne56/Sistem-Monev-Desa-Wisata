import React from "react";
import bangli from "../../assets/Lokasi/KabupatenWisata/bangli.png";
import banyuwangi from "../../assets/Lokasi/KabupatenWisata/banyuwangi.png";
import bintan from "../../assets/Lokasi/KabupatenWisata/bintan.png";
import sleman from "../../assets/Lokasi/KabupatenWisata/sleman.png";
import gianyar from "../../assets/Lokasi/KabupatenWisata/gianyar.png";
import gunkid from "../../assets/Lokasi/KabupatenWisata/gunkid.png";
import rajaAmpat from "../../assets/Lokasi/KabupatenWisata/rajaAmpat.png";
import tabanan from "../../assets/Lokasi/KabupatenWisata/tabanan.png";
import torajaUtara from "../../assets/Lokasi/KabupatenWisata/torajaUtara.png";

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

export const LokasiSection2 = () => {
  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Kabupaten/Kota Desa Wisata Populer</h2>

        <div className="space-y-5">
          {/* Baris 1 */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5">
            <Card image={rajaAmpat} label="Daerah Istimewa Yogyakarta" span="md:col-span-5" />
            <Card image={gianyar} label="Jawa Timur" span="md:col-span-2" />
            <Card image={bangli} label="Bali" span="md:col-span-2" />
          </div>

          {/* Baris 2 */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5">
            <Card image={gunkid} label="Jawa Tengah" span="md:col-span-2" />
            <Card image={torajaUtara} label="Nusa Tenggara Timur" span="md:col-span-2" />
            <Card image={bintan} label="Sumatra Barat" span="md:col-span-5" />
          </div>

          {/* Baris 3 */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5">
            <Card image={banyuwangi} label="Aceh" span="md:col-span-5" />
            <Card image={sleman} label="Jawa Barat" span="md:col-span-2" />
            <Card image={tabanan} label="Papua" span="md:col-span-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

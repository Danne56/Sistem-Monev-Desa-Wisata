import React from "react";
import location from "../../assets/Atraksi/location.svg";
import gunungApiPurba from "../../assets/Atraksi/WisataPopuler/gunungApiPurba.webp";
import indroKiloHills from "../../assets/Atraksi/WisataPopuler/indroKiloHills.webp";
import kawahSikidang from "../../assets/Atraksi/WisataPopuler/kawahSikidang.webp";
import paralayang from "../../assets/Atraksi/WisataPopuler/paralayang.webp";
import sentraOpak from "../../assets/Atraksi/WisataPopuler/sentraOpak.webp";

const Card = ({ image, title, locationName }) => (
  <div className="relative w-full h-full rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
    <div className="absolute inset-0 bg-black/30" />
    <div className="absolute bottom-0 left-0 p-4 z-10 text-white">
      <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
      <div className="flex items-center mt-1 text-xs sm:text-sm">
        <img src={location} alt="location icon" className="w-4 h-4 mr-1" />
        <span>{locationName}</span>
      </div>
    </div>
  </div>
);

export const AtraksiSection1 = () => {
  return (
    <section className="py-10 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Atraksi Wisata Alam Populer</h2>

        <div
          className="grid gap-4
                        grid-cols-1 
                        md:grid-cols-12
                        auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px] lg:auto-rows-[340px]"
        >
          {/* Baris 1 */}
          <div className="md:col-span-3">
            <Card image={gunungApiPurba} title="Trekking Gunung Api Purba" locationName="Desa Wisata Nglanggeran" />
          </div>
          <div className="md:col-span-6">
            <Card image={indroKiloHills} title="Indrokilo Hills" locationName="Desa Wisata Dewi Sinta" />
          </div>
          <div className="md:col-span-3">
            <Card image={paralayang} title="Paralayang" locationName="Desa Wisata Bayua" />
          </div>

          {/* Baris 2 */}
          <div className="md:col-span-9">
            <Card image={kawahSikidang} title="Kawah Sikidang" locationName="Desa Wisata Dieng Kulon" />
          </div>
          <div className="md:col-span-3">
            <Card image={sentraOpak} title="Setren Opak" locationName="Desa Wisata Dewi Sinta" />
          </div>
        </div>
      </div>
    </section>
  );
};

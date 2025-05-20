import React from "react";
import location from "../../assets/Beranda/location.svg";
import Top1 from "../../assets/Beranda/DewiSinta.webp";
import Top2 from "../../assets/Beranda/GoaCemara.webp";
import Top3 from "../../assets/Beranda/Nglanggeran.webp";
import shadow from "../../assets/Beranda/shadow.png";
import { Link } from "react-router-dom";

export const Section1 = () => {
  const data = [
    { id: 1, title: "Desa Wisata Dewi Sinta", location: "Kabupaten Bantul", image: Top1 },
    { id: 2, title: "Desa Wisata Goa Cemara", location: "Kabupaten Gunungkidul", image: Top2 },
    { id: 3, title: "Desa Wisata Dewi Sinta", location: "Kabupaten Bantul", image: Top1 },
    { id: 4, title: "Desa Wisata Nglanggeran", location: "Kabupaten Gunungkidul", image: Top3 },
    { id: 5, title: "Desa Wisata Goa Cemara", location: "Kabupaten Gunungkidul", image: Top2 },
  ];

  return (
    <section className="dewitaTerpopuler grid place-items-center mt-12 xl:py-16 lg:py-14 md:py-10 sm:py-8 p-4">
      <h2 className="lg:text-[40px] md:text-[36px] sm:text-[32px] text-[28px] font-extrabold my-8 text-center leading-tight">Desa Wisata Terpopuler</h2>

      <div className="w-full max-w-7xl space-y-6">
        {/* Grid atas: 2 item */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.slice(0, 2).map((item) => (
            <CardWisata key={item.id} item={item} />
          ))}
        </div>

        {/* Grid bawah: 3 item */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.slice(2).map((item) => (
            <CardWisata key={item.id} item={item} />
          ))}
        </div>
      </div>

      <Link to="/lokasi">
        <button className="mt-8 rounded-full border-none focus:outline-none bg-greenMain py-3 px-6 text-white">Jelajahi Wisata Lainnya</button>
      </Link>
    </section>
  );
};

const CardWisata = ({ item }) => {
  return (
    <div className="cardWisata rounded-lg bg-center bg-cover text-white relative h-[260px] sm:h-[300px] md:h-[340px] lg:h-[400px]" style={{ backgroundImage: `url(${item.image})` }}>
      <img className="absolute rounded-lg inset-0 w-full h-full object-cover z-0 opacity-50" src={shadow} alt="shadow" />
      <div className="informasiTop2 flex items-center gap-3 absolute px-4 top-4 left-4 z-10">
        <h1 className="text-white lg:text-[58px] md:text-[50px] sm:text-[46px] text-[40px] font-extrabold">{item.id}</h1>
        <div className="informasiWisata">
          <p className="namaDewita font-bold lg:text-lg text-base">{item.title}</p>
          <div className="lokasiDewita flex items-center gap-1 lg:text-[14px] text-[12px] mt-[2px]">
            <img className="w-4 h-4" src={location} alt="icon Lokasi" />
            <p>{item.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

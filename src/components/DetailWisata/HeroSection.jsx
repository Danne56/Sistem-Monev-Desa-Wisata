import React from "react";
import shadow from "../../assets/DetailWisata/shadow.png";

export const HeroSection = ({ image }) => {
  return (
    <section className="fotoWisata relative">
      <img src={shadow} alt="shadow" className="w-full absolute z-10" />
      <img
        src={image}
        alt="foto desa wisata"
        className="w-full max-h-[650px] lg:min-h-[500px] md:min-h-[450px] h-[500px] object-cover relative z-0"
      />
    </section>
  );
};

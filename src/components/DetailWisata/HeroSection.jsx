import React from "react";
import fotoDewita from "../../assets/DetailWisata/nglanggeran.webp";
import shadow from "../../assets/DetailWisata/shadow.png";

export const HeroSection = () => {
  return (
    <section className="fotoWisata">
      <img src={shadow} alt="shadow" className="w-full absolute" />
      <img src={fotoDewita} alt="fotoDewita" className="w-full max-h-[650px] lg:min-h-[500px] md:min-h-[450px] h-[500px] object-cover" />
    </section>
  );
};

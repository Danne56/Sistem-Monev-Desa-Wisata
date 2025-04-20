import React from "react";
import { HeroSection } from "../components/DetailWisata/HeroSection";
import { InformasiWisata } from "../components/DetailWisata/InformasiWisata";
import { GaleriWisata } from "../components/DetailWisata/GaleriWisata";
import { AtraksiWisata } from "../components/DetailWisata/AtraksiWisata";
import { SouvenirWisata } from "../components/DetailWisata/SouvenirWisata";

export const DetailWisata = () => {
  return (
    <>
      <HeroSection />
      <InformasiWisata />
      <GaleriWisata />
      <AtraksiWisata />
      <SouvenirWisata />
    </>
  );
};

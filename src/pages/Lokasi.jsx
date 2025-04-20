import React from "react";
import { HeroLokasi } from "../components/Lokasi/HeroLokasi";
import { LokasiSection1 } from "../components/Lokasi/LokasiSection1";
import { LokasiSection2 } from "../components/Lokasi/LokasiSection2";
import { LokasiSection3 } from "../components/Lokasi/LokasiSection3";

export const Lokasi = () => {
  return (
    <>
      <HeroLokasi />
      <LokasiSection1 />
      <LokasiSection2 />
      <LokasiSection3 />
    </>
  );
};

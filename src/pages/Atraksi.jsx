import React from "react";
import { HeroAtraksi } from "../components/Atraksi/HeroAtraksi";
import { AtraksiSection1 } from "../components/Atraksi/AtraksiSection1";
import { AtraksiSection2 } from "../components/Atraksi/AtraksiSection2";
import { AtraksiSection3 } from "../components/Atraksi/AtraksiSection3";
import { AtraksiSection4 } from "../components/Atraksi/AtraksiSection4";

export const Atraksi = () => {
  return (
    <>
      <HeroAtraksi />
      <AtraksiSection1 />
      <AtraksiSection2 />
      <AtraksiSection3 />
      <AtraksiSection4 />
    </>
  );
};

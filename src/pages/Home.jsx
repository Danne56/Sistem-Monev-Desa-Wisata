import React from "react";
import { Hero } from "../components/Beranda/Hero";
import { Section1 } from "../components/Beranda/Section1";
import { Section2 } from "../components/Beranda/Section2";
import { Section3 } from "../components/Beranda/Section3";
import { Section4 } from "../components/Beranda/Section4";

export const Home = () => {
  return (
    <>
      <Hero />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </>
  );
};

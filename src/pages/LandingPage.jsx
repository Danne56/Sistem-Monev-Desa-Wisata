import React from "react";
import { HeroLandingPage } from "../components/LandingPage/HeroLandingPage";
import { SectionSatu } from "../components/LandingPage/SectionSatu";
import { SectionDua } from "../components/LandingPage/SectionDua";
import { SectionTiga } from "../components/LandingPage/SectionTiga";
import { SectionEmpat } from "../components/LandingPage/SectionEmpat";
import { SectionLima } from "../components/LandingPage/SectionLima";

export const LandingPage = () => {
  return (
    <>
      <HeroLandingPage />
      <SectionSatu />
      <SectionDua />
      <SectionTiga />
      <SectionEmpat />
      <SectionLima />
    </>
  );
};

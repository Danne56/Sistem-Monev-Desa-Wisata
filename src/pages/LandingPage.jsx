import React from "react";
import { HeroLandingPage } from "../components/LandingPage/HeroLandingPage";
import { SectionSatu } from "../components/LandingPage/SectionSatu";
import { SectionDua } from "../components/LandingPage/SectionDua";

export const LandingPage = () => {
  return (
    <>
      <HeroLandingPage />
      <SectionSatu />
      <SectionDua />
    </>
  );
};

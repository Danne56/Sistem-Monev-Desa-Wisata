import React, { useState } from "react";
import { DeskripsiDesa } from "../components/DashboardPengelola/DeskripsiDesa";
import FasilitasProduk from "../components/DashboardPengelola/FasilitasProduk";
import { Sidebar } from "../components/DashboardPengelola/Sidebar";

export const DashboardPengelola = () => {
  const [activeSection, setActiveSection] = useState("deskripsi");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {activeSection === "deskripsi" ? <DeskripsiDesa /> : <FasilitasProduk />}
    </div>
  );
};

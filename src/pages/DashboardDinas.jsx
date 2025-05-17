import React, { useState } from "react";
import { Sidebar } from "../components/DashboardDinas/Sidebar";
import { KategoriDesa } from "../components/DashboardDinas/KategoriDesa";
import { StatusDesa } from "../components/DashboardDinas/StatusDesa";

export const DashboardDinas = () => {
  const [activeSection, setActiveSection] = useState("kategori");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {activeSection === "kategori" ? <KategoriDesa /> : <StatusDesa />}
    </div>
  );
};

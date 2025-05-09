import React, { useState } from "react";
import { Sidebar } from "../components/DashboardAdmin/Sidebar";
import { KategoriDesa } from "../components/DashboardAdmin/KategoriDesa";
import { StatusDesa } from "../components/DashboardAdmin/StatusDesa";

export const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState("kategori");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {activeSection === "kategori" ? <KategoriDesa /> : <StatusDesa />}
    </div>
  );
};

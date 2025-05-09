import React, { useState } from "react";
import { Verifikasi } from "../components/DashboardDinas/Verifikasi";
import { Sidebar } from "../components/DashboardDinas/Sidebar";
import { Akun } from "../components/DashboardDinas/Akun";

export const DashboardDinas = () => {
  const [activeSection, setActiveSection] = useState("verifikasi");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {activeSection === "verifikasi" ? <Verifikasi /> : <Akun />}
    </div>
  );
};

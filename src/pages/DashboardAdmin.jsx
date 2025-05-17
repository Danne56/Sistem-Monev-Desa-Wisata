import React, { useState } from "react";
import { Verifikasi } from "../components/DashboardAdmin/Verifikasi";
import { Sidebar } from "../components/DashboardAdmin/Sidebar";
import { Akun } from "../components/DashboardAdmin/Akun";

export const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState("verifikasi");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {activeSection === "verifikasi" ? <Verifikasi /> : <Akun />}
    </div>
  );
};

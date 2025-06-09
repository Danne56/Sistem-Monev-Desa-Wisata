import React, { useState, useEffect } from "react";
import verifikasi from "../../assets/Dashboard/verifikasi.svg";
import accountCircle from "../../assets/Dashboard/accountCircle.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger menu for mobile */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-20">
          <button onClick={toggleSidebar} className="bg-black text-white p-2 rounded-md">
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      )}

      {/* Sidebar content */}
      <div
        className={`bg-white md:w-64 flex-shrink-0 border-r border-gray-200 fixed md:sticky top-0 h-screen md:h-screen z-40 transition-all duration-300 ease-in-out overflow-y-auto ${isOpen ? "left-0 w-64" : "-left-64 w-0 md:left-0 md:w-64"}`}
      >
        <Link to="/home">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">M</div>
            <span className="ml-2 font-bold text-lg">Monev</span>
          </div>
        </Link>

        <nav className="mt-6">
          <div className={`flex items-center px-4 py-3 cursor-pointer ${activeSection === "verifikasi" ? "bg-gray-100 border-l-4 border-black" : ""}`} onClick={() => handleNavClick("verifikasi")}>
            <div className="w-6 h-6 mr-3">
              <img src={verifikasi} alt="icon-verif" />
            </div>
            <span className={activeSection === "verifikasi" ? "font-medium" : "text-gray-600"}>Permintaan Verifikasi</span>
          </div>

          <div className={`flex items-center px-4 py-3 cursor-pointer ${activeSection === "kelolakun" ? "bg-gray-100 border-l-4 border-black" : ""}`} onClick={() => handleNavClick("kelolakun")}>
            <div className="w-6 h-6 mr-3">
              <img src={accountCircle} alt="kelola-akun" />
            </div>
            <span className={activeSection === "kelolakun" ? "font-medium" : "text-gray-600"}>Kelola Akun</span>
          </div>

          <div className={`flex items-center px-4 py-3 cursor-pointer ${activeSection === "akun" ? "bg-gray-100 border-l-4 border-black" : ""}`} onClick={() => handleNavClick("akun")}>
            <div className="w-6 h-6 mr-3">
              <img src={accountCircle} alt="accountCircle" />
            </div>
            <span className={activeSection === "akun" ? "font-medium" : "text-gray-600"}>Akun</span>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && isMobile && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleSidebar} />}
    </>
  );
};

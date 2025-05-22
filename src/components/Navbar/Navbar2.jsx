import React, { useState, useEffect, useRef, useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Navbar/favicon.png";
import kosong from "../../assets/Navbar/kosong.jpeg";
import { TbNews } from "react-icons/tb";
import { TbUserEdit } from "react-icons/tb";
import { MdLogin } from "react-icons/md";
import { UserContext } from "../../context/UserContext";

export const Navbar2 = () => {
  const { user } = useContext(UserContext);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  // const [user, setUser] = useState(false);
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 1) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const navLinks = [
    { to: "/home", text: "Beranda" },
    { to: "/lokasi", text: "Laporkan" },
    { to: "/atraksi", text: "Laporan" },
  ];

  const navbarClasses = `w-full absolute top-0 z-50 bg-white text-black shadow-sm sticky top-0`;

  const buttonMasuk = `hover:brightness-90 duration-150 w-[95px] h-[51px] px-6 py-4 rounded-[12px] border border-black text-black`;

  const buttonDaftar = `hover:brightness-90 hover:border duration-150 w-[95px] h-[51px] px-6 py-4 bg-greenMain text-white rounded-[12px] justify-center items-center gap-2.5 inline-flex`;

  const settingProfile = `text-black xl:text-xl text-normal font-semibold sm:block hidden`;
  // Fungsi untuk memeriksa apakah link sesuai dengan path URL saat ini
  const isLinkActive = (path) => (path === "/" ? location.pathname === path : location.pathname.startsWith(path));

  const splitNama = user?.data.fullname.split(" ")[0];

  return (
    <header className={navbarClasses}>
      <nav className="   2xl:py-6 py-3 px-2 h-full flex justify-between items-center">
        <div className="logo  ml-5 flex items-center py-3  ">
          <Link to="/home" className="w-40 sm:w-64 flex justify-center items-center gap-3">
            <img src={logo} className="w-10 h-10 object-cover" alt="logo" />
            <span className="text-body font-bold">Monev</span>
          </Link>
        </div>
        <div className="nav-kiri lg:w-[750px] sm:w-[700px] hidden font-semibold text-normal lg:ml-14 sm:ml-3  min-[920px]:flex justify-start items-center">
          <Link to="/home" className={`ml-4 ${isLinkActive("/") ? "text-yellowMain" : ""}`}>
            Beranda
          </Link>
          <Link to="/lokasi" className={`ml-4 ${isLinkActive("/lokasi") ? "text-yellowMain" : ""}`}>
            Lokasi
          </Link>
          <Link to="/atraksi" className={`ml-4 ${isLinkActive("/atraksi") ? "text-yellowMain" : ""}`}>
            Atraksi
          </Link>
        </div>

        <div className="font-semibold text-normal ">
          {user ? (
            <div className="relative inline-block" ref={dropdownRef}>
              <div className=" flex justify-start items-center gap-3 cursor-pointer hover:brightness-95 duration-100 mr-6" onClick={() => setShowDropdown(!showDropdown)}>
                <img className="sm:w-[60px] sm:h-[60px] w-12 h-12 object-cover rounded-full border-2 border-white" src={kosong} alt="Profile" />
                <div className={settingProfile}>{splitNama}</div>
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-4 sm:max-w-62 w-52 bg-white rounded-md shadow-lg z-10">
                  <div className="pt-5 pb-1">
                    <div className="md:text-normal text-smallText px-4 mb-2">
                      <p className="text-black font-semibold">{splitNama}</p>
                      <p className="text-[#8A8A8A]">{user?.data.email}</p>
                    </div>
                    <hr />
                    {user?.data.role === "dinas" && (
                      <Link to="/dashboard/dinas" className="text-black flex items-center gap-3 mt-2 hover:bg-gray-100 duration-150 cursor-pointer px-4 py-2">
                        <TbNews className="md:text-2xl text-xl" />
                        <p className="font-semibold md:text-normal text-smallText ">Dashboard</p>
                      </Link>
                    )}
                    {user?.data.role === "admin" && (
                      <Link to="/dashboard/admin" className="text-black flex items-center gap-3 mt-2 hover:bg-gray-100 duration-150 cursor-pointer px-4 py-2">
                        <TbNews className="md:text-2xl text-xl" />
                        <p className="font-semibold md:text-normal text-smallText ">Dashboard</p>
                      </Link>
                    )}
                    {user?.data.role === "pengelola" && (
                      <Link to="/dashboard/dinas" className="text-black flex items-center gap-3 mt-2 hover:bg-gray-100 duration-150 cursor-pointer px-4 py-2">
                        <TbNews className="md:text-2xl text-xl" />
                        <p className="font-semibold md:text-normal text-smallText ">Dashboard</p>
                      </Link>
                    )}

                    {/* <Link className="text-black flex items-center gap-3 mt-2 hover:bg-gray-100 duration-150 cursor-pointer px-4 py-2">
                      <TbUserEdit className="md:text-2xl text-xl" />
                      <p className="font-semibold md:text-normal text-smallText ">Edit Profile</p>
                    </Link> */}
                    <div onClick={handleLogout} className="text-[#B3261E] flex items-center gap-3 mt-2 hover:bg-gray-100 duration-150 cursor-pointer px-4 py-2">
                      <MdLogin className="md:text-2xl text-xl" />
                      <p className="font-semibold md:text-normal text-smallText ">Keluar</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex mr-10 max-[920px]:hidden">
              <Link to="/masuk" className="ml-4">
                <div className={buttonMasuk}>
                  <div className="text-base font-semibold ">Masuk</div>
                </div>
              </Link>
              <Link to="/register" className="ml-4">
                <div className={buttonDaftar}>
                  <div className="text-base font-semibold  ">Daftar</div>
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className="hamburger">
          <GiHamburgerMenu
            className="w-6 h-6 ml-3 mr-3 min-[920px]:hidden"
            onClick={() => {
              setShowMobileNav(!showMobileNav);
            }}
          />
        </div>
        {/* Mobile Nav */}
        <div className={`bg-white shadow-sm pb-8 fixed top-0 inset-x-0 h-full z-50 transform ${showMobileNav ? "translate-x-0" : "-translate-x-[109%]"} transition-transform duration-300 ease-in-out min-[920px]:hidden`}>
          {/* Close icon or back button could be placed here */}
          <AiOutlineClose className="text-black mt-5 w-5 h-5 absolute right-3" onClick={() => setShowMobileNav(false)} />
          <div className="overflow-hidden nav-kiri mt-20 sm:text-body text-normal flex flex-col items-center p-4">
            <div className="flex flex-col gap-3 mb-6">
              {user && (
                <>
                  <Link to="/masuk" className="ml-4">
                    <div className="hover:brightness-90 duration-150 max-w-[95px] max-h-[51px] md:px-6 md:py-4 px-5 py-3 rounded-[12px] border border-black text-black justify-center items-center gap-2.5 inline-flex">
                      <div className="text-base font-semibold ">Masuk</div>
                    </div>
                  </Link>
                  <Link to="/daftar" className="ml-4">
                    <div className="hover:brightness-90 hover:border duration-150 max-w-[95px] max-h-[51px] md:px-6 md:py-4 px-5 py-3 bg-greenMain text-white rounded-[12px] justify-center items-center gap-2.5 inline-flex">
                      <div className="text-base font-semibold  ">Daftar</div>
                    </div>
                  </Link>
                </>
              )}
            </div>
            {navLinks.map((link, index) => (
              <Link key={index} to={link.to} className="text-black mb-4 duration-100 hover:brightness-90" onClick={() => setShowMobileNav(false)}>
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

import React from "react";
import logo from "../../assets/Navbar/favicon.png";
import fbIcon from "../../assets/Footer/fbIcon.svg";
import igIcon from "../../assets/Footer/igIcon.svg";
import xIcon from "../../assets/Footer/xIcon.svg";
import ytbIcon from "../../assets/Footer/ytbIcon.svg";
import waIcon from "../../assets/Footer/waIcon.svg";
import playStore from "../../assets/Footer/playStore.svg";
import appStore from "../../assets/Footer/appStore.svg";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer>
      <div className="bg-[#08500D] py-20 md:px-40 sm:px-30 px-8">
        <div className="flex flex-wrap gap-4 justify-between ">
          <div>
            <div className="flex items-center lg:text-3xl md:text-2xl sm:text-xl text-[18px] gap-4 font-extrabold text-white">
              <img src={logo} alt="EcoLogo" className="md:w-8 sm:w-6 w-4" />
              <span>Monev</span>
            </div>
            <p className="max-w-[360px] my-6 text-[#eee] md:text-normal text-[14px]">Aplikasi Monev memudahkan Anda dalam memonitor, mengoptimasi, dan mengevaluasi performa desa wisata anda.</p>
            <div className="ctaDowload">
              <p className="md:text-normal text-[14px] font-bold text-white">Download aplikasi Monev</p>
              <div className="dowloadApp flex md:gap-4 gap-2 items-center mt-4 flex-wrap">
                <img src={playStore} alt="playStore" />
                <img src={appStore} alt="appStore" />
              </div>
            </div>
          </div>
          <div>
            <p className="font-extrabold text-white my-3">Desa Wisata</p>

            <div className="text-[#eee] font-semibold cursor-pointer">
              <Link to="/">
                <p className="mb-3">Beranda</p>
              </Link>
              <Link to="/laporkan">
                <p className="mb-3">Laporkan</p>
              </Link>
              <Link to="/laporan">
                <p className="mb-3">Laporan</p>
              </Link>
              <Link to="/statistik">
                <p className="mb-3">Statistik</p>
              </Link>
              <Link to="/tentang">
                <p className="mb-3">Tentang Kami</p>
              </Link>
            </div>
          </div>
          <div>
            <p className="font-extrabold text-white my-3">Hubungi Kami</p>
            <Link to="https://www.instagram.com/alfianmnaa/" target="_blank">
              <div className="flex gap-4">
                <img src={waIcon} alt="waIcon" />
                <img src={igIcon} alt="igIcon" />
                <img src={ytbIcon} alt="ytbIcon" />
                <img src={xIcon} alt="xIcon" />
                <img src={fbIcon} alt="fbIcon" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#054008] md:px-40 sm:px-20 px-14 py-10 flex flex-wrap justify-between gap-4 ">
        <p className="text-[#9C9C9C] text-center md:text-normal text-verySmallText">© 2025 Monev. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

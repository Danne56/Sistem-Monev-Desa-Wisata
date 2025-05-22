import React from "react";
import HeroBerandaImg from "../../assets/Beranda/heroPic.webp";
import arrow_outward from "../../assets/Beranda/arrow_outward.svg";
import { Link } from "react-router-dom";

export const Hero = () => {
  const backgroundImageStyle = {
    backgroundImage: `url(${HeroBerandaImg})`,
  };
  return (
    <section>
      <div className="sm:h-screen h-[650px] w-full bg-center bg-no-repeat bg-cover lg:px-28 md:px-14 sm:px-10 px-6  relative" style={backgroundImageStyle}>
        <div className="HeroTopFive">
          <div className="heroInformation absolute sm:bottom-[30%] bottom-1/4 ">
            <h1 className="xl:text-[64px] lg:text-[58px] md:text-[52px] sm:text-[48px] text-[36px] font-extrabold text-white">Desa Wisata Penglipuran </h1>
            <p className="text-gray-100 2xl:text-body lg:text-[18px] md:text-normal text-sm max-w-[920px] leading-normal my-5 text-start">
              Desa Wisata Penglipuran terletak cukup strategis berjarak 60 km dengan jarak tempuh 1 jam 30 menit dari Bandara Internasional Ngurah Rai. Secara georafis terletak pada ketinggian 600- 650 m dari permukaan air laut, sehingga
              memiliki suhu yang cukup sejuk
            </p>

            <Link to="/lokasi">
              <button className="buttonJelajahi border-[1px] border-white py-2 px-6 rounded-full flex justify-start items-center gap-2 mt-8">
                <p className="text-white  2xl:text-body lg:text-[18px] text-normal">Jelajahi</p>
                <img src={arrow_outward} alt="arrow_outward" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

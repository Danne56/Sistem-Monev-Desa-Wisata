import React, { useState } from "react";
import heroLokasi from "../../assets/Lokasi/heroLokasi.png";
import searchIcon from "../../assets/Lokasi/searchIcon.svg";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import Indonesia from "../../data/dataProvinsi";

export const HeroLokasi = () => {
  const [isOpenProvinsi, setIsOpenProvinsi] = useState(false);
  const [provinsiDipilih, setProvinsiDipilih] = useState("");

  const handleProvinsiSelect = (option) => {
    setProvinsiDipilih(option);
  };

  const breakPoint = "";
  return (
    <section>
      <div>
        <div className="w-full 2xl:h-[550px] lg:h-[450px] md:h-[500px] h-[480px] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${heroLokasi})` }} />
        <div className="w-full absolute 2xl:top-36 md:top-28 top-32 flex flex-col justify-center sm:p-10 p-4">
          <h2 className="text-white 2xl:text-[44px] md:text-[40px] text-4xl  font-extrabold text-center md:leading-normal leading-normal mb-4">Jelajahi Desa Wisata di Indonesia</h2>
          <div className="flex mx-auto">
            <div>
              <div className="bg-white flex justify-between items-center px-4 py-6 rounded-l-md md:gap-2 gap-1 max-w-60  border-r-[1px] border-[#D9D9D9] cursor-pointer" onClick={() => setIsOpenProvinsi(!isOpenProvinsi)}>
                <CiLocationOn className="md:text-2xl text-xl" />
                <span className="text-smallText font-semibold md:block hidden"> {provinsiDipilih || "Provinsi"}</span>
                {provinsiDipilih ? " " : <IoMdArrowDropdown className="md:text-2xl text-xl md:block hidden" />}
              </div>
              {isOpenProvinsi && (
                <div className="absolute z-50 w-72 max-h-96 overflow-y-scroll mt-1 bg-white shadow-lg rounded-md" onClick={() => setIsOpenProvinsi(false)}>
                  <ul className="p-2">
                    {Indonesia.map((provinsi, index) => (
                      <li className="cursor-pointer hover:bg-gray-100" key={index} onClick={() => handleProvinsiSelect(provinsi.namaProvinsi)}>
                        {provinsi.namaProvinsi}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="search-wrapper flex justify-center ">
              <input id="search" type="text" className="input-search border-l-[0.1px] border-gray-300 p-3 outline-none sm:p-4 w-full lg:min-w-[450px] md:min-w-80 sm:min-w-72 min-w-56" placeholder="cari disini..." />
              <img src={searchIcon} alt="search-icon" className="p-3 sm:p-4 lg:w-16 md:w-14 w-12  bg-greenMain rounded-r-lg cursor-pointer hover:brightness-90 duration-75 " />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

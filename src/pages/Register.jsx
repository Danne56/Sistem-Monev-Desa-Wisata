import React, { useState } from "react";
import { Link } from "react-router-dom";
import mataBuka from "../assets/Register/mataBuka.svg";
import mataTutup from "../assets/Register/mataTutup.svg";
import other_pay from "../assets/Register/other-pay.png";
import curug from "../assets/Register/curug.png";
import arrowDown from "../assets/Register/arrowDown.svg";
import Indonesia from "../data/dataProvinsi";

export const Register = () => {
  const [isOpenProvinsi, setIsOpenProvinsi] = useState(false);
  const [isOpenKabupaten, setIsOpenKabupaten] = useState(false);
  const [provinsiDipilih, setProvinsiDipilih] = useState("");
  const [kabupatenDipilih, setKabupatenDipilih] = useState("");
  const [isClosed, setIsClosed] = useState(true);

  const toggleEye = () => {
    setIsClosed(!isClosed);
  };
  const handleProvinsiSelect = (option) => {
    setProvinsiDipilih(option);
    onSelectData({
      Provinsi: option,
      Kabupaten: kabupatenDipilih,
    });
  };

  const handleKabupatenSelect = (option) => {
    setKabupatenDipilih(option);
    onSelectData({
      Provinsi: provinsiDipilih,
      Kabupaten: option,
    });
  };

  return (
    <>
      <section className="">
        <div className="container-register flex">
          <div className="lg:[w-70%] h-auto w-full flex justify-center mt-24 px-4">
            <form className="login-container xl:min-w-[880px] lg:min-w-[620px] min-w-[90%] h-auto ">
              <h1 className=" text-[26px] mb-4 font-bold tracking-[-0.64px] leading-tight">
                Welcome to <span className="text-greenMain">Monev Dewita</span> 👋
              </h1>
              <div className="mt-4 mb-6">
                <p className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">Provinsi</p>
                <div className="relative">
                  <div className="w-full flex items-center justify-between border mt-2 rounded-md border-[#222] px-4 py-3  shadow-sm focus:outline-none" onClick={() => setIsOpenProvinsi(!isOpenProvinsi)}>
                    {provinsiDipilih || "Pilih Provinsi"}
                    <img src={arrowDown} alt="arrowDown" className="ml-2" />
                  </div>
                  {isOpenProvinsi && (
                    <div className="absolute z-50 max-h-96 overflow-y-scroll w-full mt-1 bg-white shadow-lg rounded-md" onClick={() => setIsOpenProvinsi(false)}>
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
              </div>
              {provinsiDipilih && (
                <div className="mb-6">
                  <p className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">Kabupaten</p>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between border mt-2 rounded-md border-[#222] px-4 py-3  shadow-sm focus:outline-none" onClick={() => setIsOpenKabupaten(!isOpenKabupaten)}>
                      {kabupatenDipilih || "Pilih Kabupaten"}
                      <img src={arrowDown} alt="arrowDown" className="ml-2" />
                    </div>
                    {isOpenKabupaten && (
                      <div className="absolute z-20 max-h-64 overflow-y-scroll w-full mt-1 bg-white shadow-lg rounded-md" onClick={() => setIsOpenKabupaten(false)}>
                        <ul className="p-2 ">
                          {Indonesia.find((provinsi) => provinsi.namaProvinsi === provinsiDipilih).kabupatenKota.map((kabupaten, index) => (
                            <li key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => handleKabupatenSelect(kabupaten)}>
                              {kabupaten}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="desa" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Nama Desa
                </label>
                <input id="desa" type="text" required placeholder="Contoh: Turi " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
              </div>
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="dewita" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Nama Desa Wisata
                </label>
                <input id="dewita" type="text" required placeholder="Contoh: Nganggring " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
              </div>
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="alamatDewita" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Alamat Lengkap
                </label>
                <input id="alamatDewita" type="text" required placeholder="Contoh: Jl Turi no 3, Slelam , Daerah Istimewa Yopgyakarta " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
              </div>
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="namaPengelola" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Nama Pengelola
                </label>
                <input id="namaPengelola" type="text" required placeholder="Contoh: nama pengelola " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
              </div>
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="noTelepon" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Nomor Telepon
                </label>
                <input id="noTelepon" type="text" required placeholder="Contoh: 0812345678 " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
              </div>
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="email" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Email
                </label>
                <input id="email" type="email" required placeholder="Contoh: JohnDoe@gmail.com " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" autoComplete="email" />
              </div>
              <div className="confirmPassword flex flex-wrap justify-between sm:gap-2 gap-0">
                <div className="input2 flex flex-col mb-6 relative sm:w-[49%] w-full">
                  <label htmlFor="password" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                    Password:
                  </label>
                  <input required type={isClosed ? "password" : "text"} id="password" placeholder="Masukkan Password!" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
                  <div className="eye-icon absolute top-5 right-0 h-full flex items-center pr-4 cursor-pointer" onClick={toggleEye}>
                    {isClosed ? <img src={mataTutup} alt="mataTutup" className="w-5 " /> : <img src={mataBuka} alt="mataTerbuka" className="w-5 " />}
                  </div>
                </div>
                <div className="input2 flex flex-col mb-6 relative sm:w-[49%] w-full">
                  <label htmlFor="konfirmasiPassword" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                    Ulangi Password:
                  </label>
                  <input required type={isClosed ? "password" : "text"} id="konfirmasiPassword" placeholder="Konfirmasi Password!" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-normal outline-none" />
                  <div className="eye-icon absolute top-5 right-0 h-full flex items-center pr-4 cursor-pointer" onClick={toggleEye}>
                    {isClosed ? <img src={mataTutup} alt="mataTutup" className="w-5 " /> : <img src={mataBuka} alt="mataTerbuka" className="w-5 " />}
                  </div>
                </div>
              </div>
              <button type="submit" className="button-login w-full py-3 mt-2 text-white bg-greenMain text-lg font-bold rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90">
                Register
              </button>
              <button type="submit" className="button-login w-full py-3 mt-10 text-white bg-[#333] text-base rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90 flex justify-center items-center gap-3">
                <img src={other_pay} alt="other-pay" />
                <p>Or sign in with google</p>
              </button>
              <div className="text-center mt-4">
                <span className="text-stone-500 text-base font-medium  leading-normal">Sudah punya akun? </span>
                <Link to={"/masuk"} className="text-greenMain text-base font-bold  underline leading-normal">
                  Masuk sekarang
                </Link>
              </div>
              {/* {error && <p className="wrong-input mt-4 text-center text-red-500">Email atau Password Salah!</p>} */}
            </form>
          </div>
          <img src={curug} className=" w-[40vw] xl:h-full lg:h-screen lg:block hidden object-cover" alt="img" />
        </div>
      </section>
    </>
  );
};

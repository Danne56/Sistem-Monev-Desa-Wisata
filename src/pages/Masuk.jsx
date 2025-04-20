import React, { useState } from "react";
import { Link } from "react-router-dom";
import mataBuka from "../assets/Register/mataBuka.svg";
import mataTutup from "../assets/Register/mataTutup.svg";
import other_pay from "../assets/Masuk/other-pay.png";
import penglipuran from "../assets/Masuk/penglipuran.png";

export const Masuk = () => {
  const [isClosed, setIsClosed] = useState(true);

  const toggleEye = () => {
    setIsClosed(!isClosed);
  };

  return (
    <>
      <section className="">
        <div className="container-register flex">
          <img src={penglipuran} className=" w-[70vw] h-screen lg:block hidden object-cover" alt="img" />
          <div className="lg:w-[30%] h-screen w-full grid place-items-center  ">
            <form className="login-container xl:min-w-[380px] lg:min-w-[320px] min-w-[90%] h-auto ">
              <h1 className=" text-[26px] mb-4 font-bold tracking-[-0.64px] leading-tight">
                Nice to <span className="text-greenMain">see you</span> again 👋
              </h1>
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="email" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Email
                </label>
                <input id="email" type="email" required placeholder="Contoh: JohnDoe@gmail.com " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" autoComplete="email" />
              </div>
              <div className="input2 flex flex-col mb-6 relative">
                <label htmlFor="password" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Password:
                </label>
                <input required type={isClosed ? "password" : "text"} id="password" placeholder="Masukkan Password!" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" />
                <div className="eye-icon absolute top-5 right-0 h-full flex items-center pr-4 cursor-pointer" onClick={toggleEye}>
                  {isClosed ? <img src={mataTutup} alt="mataTutup" className="w-5 " /> : <img src={mataBuka} alt="mataTerbuka" className="w-5 " />}
                </div>
              </div>
              <button type="submit" className="button-login w-full py-3 mt-2 text-white bg-greenMain text-lg font-bold rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90">
                Masuk
              </button>
              <button type="submit" className="button-login w-full py-3 mt-10 text-white bg-[#333] text-base rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90 flex justify-center items-center gap-3">
                <img src={other_pay} alt="other-pay" />
                <p>Or sign in with google</p>
              </button>
              <div className="text-center mt-4">
                <span className="text-stone-500 text-base font-medium  leading-normal">Belum punya akun? </span>
                <Link to={"/register"} className="text-greenMain text-base font-bold  underline leading-normal">
                  Daftar sekarang
                </Link>
              </div>
              {/* {error && <p className="wrong-input mt-4 text-center text-red-500">Email atau Password Salah!</p>} */}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

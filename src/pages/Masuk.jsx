import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import mataBuka from "../assets/Register/mataBuka.svg";
import mataTutup from "../assets/Register/mataTutup.svg";
import other_pay from "../assets/Masuk/other-pay.png";
import penglipuran from "../assets/Masuk/penglipuran.png";
import { axiosInstance } from "../config";

export const Masuk = () => {
  const [isClosed, setIsClosed] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Cek token saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .get("/authentication/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            navigate("/home");
          }
        })
        .catch((err) => {
          localStorage.removeItem("token");
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        });
    }
  }, [navigate]);

  const toggleEye = () => {
    setIsClosed(!isClosed);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/authentication/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        navigate("/home");
        // setTimeout(() => {
        window.location.reload();
        // }, 10);
      } else {
        throw new Error(data.message || "Login gagal");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Email atau password salah!";
      setError(errorMessage);
    }
  };

  return (
    <>
      <section className="">
        <div className="container-register flex">
          <img src={penglipuran} className="w-[70vw] h-screen lg:block hidden object-cover" alt="img" />
          <div className="lg:w-[30%] h-screen w-full grid place-items-center">
            <form onSubmit={handleLogin} className="login-container xl:min-w-[380px] lg:min-w-[320px] min-w-[90%] h-auto">
              <h1 className="text-[26px] mb-4 font-bold tracking-[-0.64px] leading-tight">
                Nice to <span className="text-greenMain">see you</span> again 👋
              </h1>

              {/* Email */}
              <div className="input2 flex flex-col mb-6">
                <label htmlFor="email" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Contoh: JohnDoe@gmail.com"
                  className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="input2 flex flex-col mb-6 relative">
                <label htmlFor="password" className="md:text-base text-smallText text-[#5D5D5D] tracking-[-0.32px] font-semibold leading-normal">
                  Password:
                </label>
                <input
                  required
                  type={isClosed ? "password" : "text"}
                  id="password"
                  placeholder="Masukkan Password!"
                  className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="eye-icon absolute top-5 right-0 h-full flex items-center pr-4 cursor-pointer" onClick={toggleEye}>
                  {isClosed ? <img src={mataTutup} alt="mataTutup" className="w-5" /> : <img src={mataBuka} alt="mataTerbuka" className="w-5" />}
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="wrong-input mt-4 text-center text-red-500">{error}</p>}

              {/* Login Button */}
              <button type="submit" className="button-login w-full py-3 mt-2 text-white bg-greenMain text-lg font-bold rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90">
                Masuk
              </button>

              {/* Google Sign In */}
              <button type="button" className="button-login w-full py-3 mt-10 text-white bg-[#333] text-base rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90 flex justify-center items-center gap-3">
                <img src={other_pay} alt="other-pay" />
                <p>Or sign in with google</p>
              </button>

              {/* Register Link */}
              <div className="text-center mt-4">
                <span className="text-stone-500 text-base font-medium leading-normal">Belum punya akun? </span>
                <Link to={"/register"} className="text-greenMain text-base font-bold underline leading-normal">
                  Daftar sekarang
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

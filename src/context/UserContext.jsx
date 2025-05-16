/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../config";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dataUserLogin, setDataUserLogin] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Tidak ada token, perlu login!");
        return;
      }

      try {
        const res = await axiosInstance.get("/authentication/me", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        setUser(res.data);
        
        // Jika ingin fetch data tambahan berdasarkan user._id
        // const userDataRes = await axiosInstance.get(`/user/${res.data._id}`);
        // setDataUserLogin(userDataRes.data);

      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, dataUserLogin, setDataUserLogin }}>
      {children}
    </UserContext.Provider>
  );
}
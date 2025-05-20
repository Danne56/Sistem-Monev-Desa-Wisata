import React from "react";
import { Link } from "react-router-dom";

export const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
        <p className="mb-4">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          to="/home"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
};

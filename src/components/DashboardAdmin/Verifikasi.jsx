// Verifikasi.jsx
import React, { useState, useEffect } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown } from "react-icons/fa";
import Swal from "sweetalert2";

export const Verifikasi = () => {
  const [requests, setRequests] = useState([
    { id: 1, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Diterima" },
    { id: 2, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Diproses" },
    { id: 3, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Selesai" },
    { id: 4, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Ditolak" },
    { id: 5, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Diterima" },
    { id: 6, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Diproses" },
    { id: 7, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Selesai" },
    { id: 8, email: "desawisata@gmail.com", name: "Desa Wisata Lorem Ipsum", date: "18/04/2025 23.17", status: "Ditolak" },
  ]);

  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".status-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const statusOptions = ["Diterima", "Diproses", "Selesai", "Ditolak"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Diterima":
        return "bg-blue-500 text-white";
      case "Diproses":
        return "bg-yellow-500 text-white";
      case "Selesai":
        return "bg-green-500 text-white";
      case "Ditolak":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const changeStatus = (requestId, newStatus) => {
    Swal.fire({
      title: "Konfirmasi Perubahan Status",
      text: `Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req)));
        setOpenDropdown(null);

        Swal.fire("Berhasil!", "Status berhasil diubah.", "success");
      }
    });
  };

  return (
    <div className="flex-1 overflow-x-auto md:ml-0 md:mt-0 mt-16">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Permintaan Verifikasi</h1>
          <div className="flex items-center">
            <div className="mr-2 text-right">
              <div className="font-semibold">Alfian Maulana</div>
              <div className="text-sm text-gray-500">Admin</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
              <img src={profile} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="text-sm mb-2">Urutkan</div>
          <div className="relative inline-block">
            <select className="border border-gray-300 rounded px-4 py-2 pr-10 appearance-none bg-white">
              <option>Permintaan Terbaru</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCaretDown size={16} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-x-scroll shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Desa Wisata
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Tanggal & Waktu Permintaan(?)
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status Request
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{request.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{request.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{request.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{request.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm relative">
                    <div className="status-dropdown">
                      <button onClick={() => toggleDropdown(request.id)} className={`inline-flex items-center px-3 py-1 rounded ${getStatusColor(request.status)}`}>
                        {request.status} <FaCaretDown size={16} className="ml-1" />
                      </button>

                      {openDropdown === request.id && (
                        <div className="absolute mt-1 w-44 bg-white rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            {statusOptions.map((status) => (
                              <li key={status}>
                                <button onClick={() => changeStatus(request.id, status)} className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${status === request.status ? "font-bold" : ""}`}>
                                  {status}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

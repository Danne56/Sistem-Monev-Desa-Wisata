import React, { useState, useEffect } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown } from "react-icons/fa";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";

export const StatusDesa = () => {
  const [villages, setVillages] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [provinceFilter, setProvinceFilter] = useState("Semua");
  const [regionFilter, setRegionFilter] = useState("Semua");

  const statusOptions = ["Aktif", "Tidak Aktif", "Perbaikan", "Kurang Terawat"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/status-desa");
        const data = response.data.data || [];
        const capitalizeFirstLetter = (string) => string.replace(/\b\w/g, (char) => char.toUpperCase());

        const mappedData = data.map((desa, index) => ({
          id: index + 1,
          kd_status: desa.kd_status,
          name: desa.nama_desa_wisata,
          status: capitalizeFirstLetter(desa.status),
          description: desa.keterangan || "-",
          province: desa.provinsi || "-",
          region: desa.kabupaten || "-",
        }));

        setVillages(mappedData);
      } catch (err) {
        console.error("Error fetching village status:", err);
        Swal.fire("Gagal", "Tidak dapat memuat data desa.", "error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".status-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const changeStatus = async (village, newStatus) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Konfirmasi Perubahan",
      text: `Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.put(
            `/api/status-desa/${village.kd_status}`,
            {
              status: newStatus.toLowerCase(),
              keterangan: `Diubah menjadi ${newStatus.toLowerCase()} oleh admin`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.status === "success") {
            // Update UI berdasarkan kd_status
            setVillages((prev) =>
              prev.map((v) =>
                v.kd_status === village.kd_status
                  ? {
                      ...v,
                      status: newStatus,
                      description: response.data.data?.keterangan || "-",
                    }
                  : v
              )
            );
            Swal.fire("Berhasil!", "Status desa berhasil diubah.", "success");
          } else {
            throw new Error("Gagal mengubah status");
          }
        } catch (err) {
          console.error("Error updating status:", err);
          Swal.fire("Gagal", err.response?.data?.message || "Gagal mengubah status desa.", "error");
        }

        setOpenDropdown(null);
      }
    });
  };

  // Logika Filter
  const filteredVillages = villages.filter((village) => {
    const matchStatus = statusFilter === "Semua" || village.status === statusFilter;

    const matchProvinsi = provinceFilter === "Semua" || village.province === provinceFilter;

    const matchKabupaten = regionFilter === "Semua" || village.region === regionFilter;

    return matchStatus && matchProvinsi && matchKabupaten;
  });

  return (
    <div className="flex-1 overflow-x-auto md:ml-0 md:mt-0 mt-16">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Status Desa</h1>
          <div className="flex items-center">
            <div className="mr-2 text-right">
              <div className="font-semibold">Alfian Maulana</div>
              <div className="text-sm text-gray-500">Dinas</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
              <img src={profile} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Status</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Semua">Semua</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Perbaikan">Perbaikan</option>
                <option value="Kurang Terawat">Kurang Terawat</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Provinsi</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white" value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}>
                <option value="Semua">Semua Provinsi</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Timur">Jawa Timur</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Kabupaten/Kota</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                <option value="Semua">Semua Kabupaten</option>
                <option value="Magelang">Magelang</option>
                <option value="Solo">Solo</option>
                <option value="Semarang">Semarang</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama Desa Wisata</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-36">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.length > 0 ? (
                filteredVillages.map((village) => (
                  <tr key={village.kd_status} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{village.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{village.name}</td>
                    <td className="px-4 py-3 text-sm min-w-36">
                      <div className="status-dropdown relative">
                        <button
                          onClick={() => toggleDropdown(village.id)}
                          className={`inline-flex items-center px-3 py-1 rounded ${
                            village.status === "Aktif" ? "bg-green-500" : village.status === "Tidak Aktif" ? "bg-red-500" : village.status === "Perbaikan" ? "bg-yellow-500" : "bg-gray-500"
                          } text-white`}
                        >
                          {village.status}
                          <FaCaretDown size={12} className="ml-2" />
                        </button>
                        {openDropdown === village.id && (
                          <div className="absolute mt-1 w-44 bg-white rounded-md shadow-lg z-10">
                            <ul className="py-1">
                              {statusOptions.map((status) => (
                                <li key={status}>
                                  <button onClick={() => changeStatus(village, status)} className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                                    {status}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{village.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    Tidak ada data desa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

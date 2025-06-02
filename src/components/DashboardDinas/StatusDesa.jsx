import React, { useState, useEffect, useContext, useCallback } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import { UserContext } from "../../context/UserContext";

export const StatusDesa = () => {
  const [villages, setVillages] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem("statusFilter") || "Semua";
  });
  const [provinceFilter, setProvinceFilter] = useState(() => {
    return localStorage.getItem("provinceFilter") || "Semua";
  });
  const [regionFilter, setRegionFilter] = useState(() => {
    return localStorage.getItem("regionFilter") || "Semua";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const statusOptions = ["Aktif", "Tidak Aktif", "Perbaikan", "Kurang Terawat"];

  useEffect(() => {
    localStorage.setItem("statusFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem("provinceFilter", provinceFilter);
  }, [provinceFilter]);

  useEffect(() => {
    localStorage.setItem("regionFilter", regionFilter);
  }, [regionFilter]);

  const cacheData = (data) => {
    const cacheObject = {
      data: data,
      timestamp: Date.now(),
      expiry: 5 * 60 * 1000,
    };
    localStorage.setItem("statusDesaCache", JSON.stringify(cacheObject));
  };

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem("statusDesaCache");
      if (!cached) return null;

      const cacheObject = JSON.parse(cached);
      const now = Date.now();

      if (now - cacheObject.timestamp < cacheObject.expiry) {
        return cacheObject.data;
      }

      localStorage.removeItem("statusDesaCache");
      return null;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  };

  const fetchData = useCallback(async (useCache = true) => {
    if (useCache) {
      const cachedData = getCachedData();
      if (cachedData) {
        setVillages(cachedData);
        setInitialLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/api/status-desa");
      const data = response.data.data || [];
      const capitalizeFirstLetter = (string) =>
        string.replace(/\b\w/g, (char) => char.toUpperCase());

      const mappedData = data.map((desa, index) => ({
        id: index + 1,
        kd_status: desa.kd_status ?? "-",
        name: desa.nama_desa_wisata ?? "-",
        status: desa.status ? capitalizeFirstLetter(desa.status) : "-",
        description: desa.keterangan ?? "-",
        province: desa.provinsi ?? "-",
        region: desa.kabupaten ?? "-",
        lastUpdated: desa.tanggal_update ?? "-",
      }));

      setVillages(mappedData);
      cacheData(mappedData);
    } catch (err) {
      console.error("Error fetching village status:", err);
      setError("Tidak dapat memuat data desa.");

      const cachedData = localStorage.getItem("statusDesaCache");
      if (cachedData) {
        try {
          const cacheObject = JSON.parse(cachedData);
          setVillages(cacheObject.data);
          setError("Menggunakan data tersimpan (offline mode)");
        } catch (cacheError) {
          console.error("Error reading old cache:", cacheError);
          Swal.fire("Gagal", "Tidak dapat memuat data desa.", "error");
        }
      } else {
        Swal.fire("Gagal", "Tidak dapat memuat data desa.", "error");
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const refreshData = () => {
    fetchData(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const cached = localStorage.getItem("statusDesaCache");
        if (cached) {
          try {
            const cacheObject = JSON.parse(cached);
            const now = Date.now();
            if (now - cacheObject.timestamp > 2 * 60 * 1000) {
              fetchData(false);
            }
          } catch (error) {
            console.error("Error checking cache age:", error);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchData]);

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
            await fetchData(false);
            Swal.fire("Berhasil!", "Status desa berhasil diubah.", "success");
          } else {
            throw new Error("Gagal mengubah status");
          }
        } catch (err) {
          console.error("Error updating status:", err);
          Swal.fire(
            "Gagal",
            err.response?.data?.message || "Gagal mengubah status desa.",
            "error"
          );
        }

        setOpenDropdown(null);
      }
    });
  };

  const { user } = useContext(UserContext);

  const filteredVillages = villages.filter((village) => {
    const matchStatus =
      statusFilter === "Semua" || village.status === statusFilter;
    const matchProvinsi =
      provinceFilter === "Semua" || village.province === provinceFilter;
    const matchKabupaten =
      regionFilter === "Semua" || village.region === regionFilter;

    return matchStatus && matchProvinsi && matchKabupaten;
  });

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FaSpinner className="animate-spin" />
          <span>Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto md:ml-0 md:mt-0 mt-16">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Status Desa</h1>
          <div className="flex items-center">
            <div className="mr-2 text-right">
              <div className="font-semibold">
                {user?.data?.fullname || "User"}
              </div>
              <div className="text-sm text-gray-500">
                {user?.data?.role || "Role"}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
              <img
                src={profile}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            {error.includes("offline") && (
              <button
                onClick={refreshData}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Coba Lagi
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Memuat data...
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Status</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
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
              <select
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white"
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
              >
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
              <select
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
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

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Desa Wisata
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-36">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Keterangan
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-40">
                  Terakhir Diubah
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.length > 0 ? (
                filteredVillages.map((village) => (
                  <tr
                    key={village.kd_status}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {village.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {village.name}
                    </td>
                    <td className="px-4 py-3 text-sm min-w-36">
                      <div className="status-dropdown relative">
                        <button
                          onClick={() => toggleDropdown(village.id)}
                          className={`inline-flex items-center px-3 py-1 rounded ${
                            village.status === "Aktif"
                              ? "bg-green-500"
                              : village.status === "Tidak Aktif"
                                ? "bg-red-500"
                                : village.status === "Perbaikan"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
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
                                  <button
                                    onClick={() =>
                                      changeStatus(village, status)
                                    }
                                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                  >
                                    {status}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {village.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 min-w-40">
                      {formatDate(village.lastUpdated)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span>Tidak ada data desa.</span>
                      <button
                        onClick={refreshData}
                        className="text-blue-500 hover:text-blue-700 text-sm underline"
                      >
                        Muat ulang data
                      </button>
                    </div>
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

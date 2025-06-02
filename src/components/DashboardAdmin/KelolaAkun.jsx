import React, { useState, useEffect, useContext, useCallback } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown, FaPencilAlt, FaSpinner, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import { UserContext } from "../../context/UserContext";

export const KelolaAkun = () => {
  const [accounts, setAccounts] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    status: "Semua",
    searchKeyword: "",
  });

  const statusOptions = ["Aktif", "Tidak Aktif"];

  // Cache functions
  const cacheData = (data) => {
    const cacheObject = {
      data: data,
      timestamp: Date.now(),
      expiry: 5 * 60 * 1000,
    };
    localStorage.setItem("kelolaAkunCache", JSON.stringify(cacheObject));
  };

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem("kelolaAkunCache");
      if (!cached) return null;
      const cacheObject = JSON.parse(cached);
      if (Date.now() - cacheObject.timestamp < cacheObject.expiry) {
        return cacheObject.data;
      }
      localStorage.removeItem("kelolaAkunCache");
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
        setAccounts(cachedData);
        setInitialLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/api/users", {
        params: {
          includeDesa: true,
        },
      });
      const data = response.data.data || [];

      const mappedData = data.map((desa, index) => ({
        id: index + 1,
        name: desa?.nama_desa || "Tidak diketahui",
        email: desa?.email || "Tidak tersedia",
        status: Boolean(desa?.is_verified) ? "Aktif" : "Tidak Aktif",
      }));

      setAccounts(mappedData);
      cacheData(mappedData);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setError("Tidak dapat memuat data desa wisata.");
      const cached = localStorage.getItem("kelolaAkunCache");
      if (cached) {
        try {
          const cacheObject = JSON.parse(cached);
          setAccounts(cacheObject.data);
          setError("Menggunakan data tersimpan (offline mode)");
        } catch (cacheError) {
          console.error("Error reading old cache:", cacheError);
          Swal.fire("Gagal", "Tidak dapat memuat data desa wisata.", "error");
        }
      } else {
        Swal.fire("Gagal", "Tidak dapat memuat data desa wisata.", "error");
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const cached = localStorage.getItem("kelolaAkunCache");
        if (cached) {
          try {
            const cacheObject = JSON.parse(cached);
            if (Date.now() - cacheObject.timestamp > 2 * 60 * 1000) {
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

  const refreshData = () => {
    fetchData(false);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const changeStatus = async (accountId, newStatus, accountEmail) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Konfirmasi Perubahan Status",
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
            `/authentication/verify/${accountEmail}`,
            {
              is_verified: newStatus === "Aktif",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.status === "success") {
            const updatedAccounts = accounts.map((acc) =>
              acc.id === accountId ? { ...acc, status: newStatus } : acc
            );
            setAccounts(updatedAccounts);
            cacheData(updatedAccounts);
            setOpenDropdown(null);
            Swal.fire("Berhasil!", "Status akun berhasil diubah.", "success");
          } else {
            throw new Error(response.data.message || "Gagal ubah status");
          }
        } catch (err) {
          console.error("Error updating status:", err);
          Swal.fire(
            "Gagal",
            err.response?.data?.message || "Tidak dapat mengubah status akun.",
            "error"
          );
        }
      }
    });
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesStatus =
      filters.status === "Semua" || acc.status === filters.status;
    const keyword = filters.searchKeyword.toLowerCase();
    const matchesSearch =
      acc.name.toLowerCase().includes(keyword) ||
      acc.email.toLowerCase().includes(keyword);
    return matchesStatus && matchesSearch;
  });

  const highlightText = (text, keyword) => {
    if (!text) return "";
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Akun</h1>
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

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
          {/* Search Bar */}
          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pencarian
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama desa atau email..."
                value={filters.searchKeyword}
                onChange={(e) =>
                  handleFilterChange("searchKeyword", e.target.value)
                }
                className="border px-4 py-2 pl-10 rounded w-full"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Status
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white"
              >
                <option value="Semua">Semua Status</option>
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-x-scroll shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Desa Wisata
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status Akun
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-4 py-3">{account.id}</td>
                    <td className="px-4 py-3">
                      {highlightText(account.name, filters.searchKeyword)}
                    </td>
                    <td className="px-4 py-3">
                      {highlightText(account.email, filters.searchKeyword)}
                    </td>
                    <td className="px-4 py-3 relative">
                      <div className="status-dropdown">
                        <button
                          onClick={() => toggleDropdown(account.id)}
                          className={`inline-flex items-center px-3 py-1 rounded ${
                            account.status === "Aktif"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {account.status}
                          <FaCaretDown className="ml-1" />
                        </button>
                        {openDropdown === account.id && (
                          <div className="absolute mt-1 w-44 bg-white rounded-md shadow-lg z-10">
                            <ul className="py-1">
                              {statusOptions.map((status) => (
                                <li key={status}>
                                  <button
                                    onClick={() =>
                                      changeStatus(
                                        account.id,
                                        status,
                                        account.email
                                      )
                                    }
                                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                                      account.status === status
                                        ? "font-bold"
                                        : ""
                                    }`}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span>Tidak ada data akun.</span>
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

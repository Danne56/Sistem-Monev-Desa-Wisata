import React, { useState, useEffect, useContext, useCallback } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown, FaSearch, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import { UserContext } from "../../context/UserContext";

export const Verifikasi = () => {
  const [requests, setRequests] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");

  const statusOptions = ["Diterima", "Diproses", "Selesai", "Ditolak"];

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const cacheData = (data) => {
    const cacheObject = {
      data,
      timestamp: Date.now(),
      expiry: 5 * 60 * 1000,
    };
    localStorage.setItem("verifikasiCache", JSON.stringify(cacheObject));
  };

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem("verifikasiCache");
      if (!cached) return null;
      const cacheObject = JSON.parse(cached);
      const now = Date.now();
      if (now - cacheObject.timestamp < cacheObject.expiry) {
        return cacheObject.data;
      }
      localStorage.removeItem("verifikasiCache");
      return null;
    } catch {
      return null;
    }
  };

  const fetchRequests = useCallback(async (useCache = true) => {
    if (useCache) {
      const cachedData = getCachedData();
      if (cachedData) {
        setRequests(cachedData);
        setInitialLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("/api/permintaan", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = response.data;

      if (result.status === "success") {
        const mappedData = result.data.map((req, index) => ({
          id: index + 1,
          kd_permintaan: req.kd_permintaan,
          email: req.email ?? "",
          name: req.nama_desa_wisata ?? "",
          date: new Date(req.created_at).toISOString(),
          status: capitalizeFirstLetter(req.status_permintaan),
          kd_desa: req.kd_desa ?? "",
        }));
        setRequests(mappedData);
        cacheData(mappedData);
      } else {
        throw new Error("Gagal memuat data");
      }
    } catch (err) {
      setError("Gagal memuat data. Menggunakan data tersimpan (offline mode)");
      const cached = getCachedData();
      if (cached) setRequests(cached);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(true);
  }, [fetchRequests]);

  const refreshData = () => fetchRequests(false);

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

  const changeStatus = async (request, newStatus) => {
    if (!newStatus || !statusOptions.includes(newStatus)) {
      return Swal.fire("Gagal", "Status tidak valid", "error");
    }

    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Ubah Status?",
      text: `Ubah ke "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, ubah!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.put(
            `/api/permintaan/${request.kd_permintaan}`,
            { status_permintaan: newStatus.toLowerCase() },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.status !== "success") throw new Error();

          const updatedRes = await axiosInstance.get(
            `/api/permintaan/${request.kd_permintaan}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const updatedRequest = updatedRes.data.data;

          const updated = requests.map((req) =>
            req.kd_permintaan === request.kd_permintaan
              ? {
                  ...req,
                  status: capitalizeFirstLetter(
                    updatedRequest.status_permintaan
                  ),
                }
              : req
          );

          setRequests(updated);
          cacheData(updated);

          if (newStatus === "Selesai") {
            await axiosInstance.post(
              "/api/status-desa",
              {
                kd_desa: updatedRequest.kd_desa,
                status: "aktif",
                keterangan: `Desa Wisata ${updatedRequest.nama_desa_wisata} telah diverifikasi.`,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }

          Swal.fire("Berhasil!", "Status diperbarui", "success");
        } catch {
          Swal.fire("Gagal", "Tidak dapat mengubah status", "error");
        }
        setOpenDropdown(null);
      }
    });
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredRequests = requests.filter((req) => {
    const name = req.name || "";
    const email = req.email || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortBy === "terbaru" ? dateB - dateA : dateA - dateB;
  });

  const { user } = useContext(UserContext);

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
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Permintaan Verifikasi</h1>
          <div className="flex items-center">
            <div className="text-right mr-2">
              <div className="font-semibold">
                {user?.data?.fullname || "User"}
              </div>
              <div className="text-sm text-gray-500">
                {user?.data?.role || "Role"}
              </div>
            </div>
            <img src={profile} className="w-10 h-10 rounded-full" />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {error}{" "}
            <button onClick={refreshData} className="underline text-blue-600">
              Coba lagi
            </button>
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

        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pencarian
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari email atau nama desa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-4 py-2 pl-10 rounded w-full"
              />
            </div>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 appearance-none bg-white"
              >
                <option value="Semua">Semua Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urutkan
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 appearance-none bg-white"
              >
                <option value="terbaru">Permintaan Terbaru</option>
                <option value="terlama">Permintaan Terlama</option>
              </select>
              <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border rounded shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Desa
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Tanggal & Waktu Permintaan
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRequests.length ? (
                sortedRequests.map((req) => (
                  <tr key={req.kd_permintaan}>
                    <td className="px-4 py-3">{req.id}</td>
                    <td className="px-4 py-3">
                      {highlightText(req.email, searchQuery)}
                    </td>
                    <td className="px-4 py-3">
                      {highlightText(req.name, searchQuery)}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(req.date).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 relative">
                      <div className="status-dropdown">
                        <button
                          onClick={() => toggleDropdown(req.id)}
                          className={`px-3 py-1 rounded ${getStatusColor(req.status)} inline-flex items-center`}
                        >
                          {req.status}
                          <FaCaretDown className="ml-1" />
                        </button>
                        {openDropdown === req.id && (
                          <div className="absolute mt-1 w-44 bg-white border rounded shadow z-10">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                onClick={() => changeStatus(req, status)}
                                className={`block px-4 py-2 text-left w-full hover:bg-gray-100 ${
                                  status === req.status ? "font-bold" : ""
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Tidak ada data ditemukan.
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

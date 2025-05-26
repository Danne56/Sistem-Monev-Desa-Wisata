import React, { useState, useEffect, useContext, useCallback } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown, FaPencilAlt, FaTimes, FaSpinner } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";

export const KategoriDesa = () => {
  const [villages, setVillages] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(() => {
    // Ambil dari localStorage atau gunakan default
    return localStorage.getItem("categoryFilter") || "Semua";
  });
  const [sortFilter, setSortFilter] = useState(() => {
    return localStorage.getItem("sortFilter") || "Rerata Tertinggi";
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentVillage, setCurrentVillage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Score form state
  const [scores, setScores] = useState({
    partisipasi_masyarakat: "",
    keragaman_paket_wisata: "",
    akses_tempat_wisata: "",
    keramahan_difabel: "",
    fasilitas_tempat_wisata: "",
    produk_tempat_wisata: "",
  });

  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);

  // Kategori yang sesuai dengan backend
  const categoryOptions = ["Mandiri", "Maju", "Berkembang", "Rintisan"];

  // Simpan filter ke localStorage ketika berubah
  useEffect(() => {
    localStorage.setItem("categoryFilter", categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    localStorage.setItem("sortFilter", sortFilter);
  }, [sortFilter]);

  // Cache data ke localStorage dengan timestamp
  const cacheData = (data) => {
    const cacheObject = {
      data: data,
      timestamp: Date.now(),
      expiry: 5 * 60 * 1000, // 5 menit cache
    };
    localStorage.setItem("villagesCache", JSON.stringify(cacheObject));
  };

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem("villagesCache");
      if (!cached) return null;

      const cacheObject = JSON.parse(cached);
      const now = Date.now();

      // Cek apakah cache masih valid (kurang dari 5 menit)
      if (now - cacheObject.timestamp < cacheObject.expiry) {
        return cacheObject.data;
      }

      // Hapus cache yang sudah expired
      localStorage.removeItem("villagesCache");
      return null;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  };

  // Fetch data dengan caching - DIPERBAIKI
  const fetchVillages = useCallback(
    async (useCache = true) => {
      // Coba ambil dari cache dulu jika diizinkan
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
        const res = await fetch("http://localhost:5000/api/skor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.status === "success") {
          const processedData = data.data.map((d) => ({
            id: d.kd_desa,
            name: d.nama_desa || "Desa Wisata",
            category: d.kategori_desa || "Rintisan", // Default kategori jika kosong
            score: d.rata_rata || 0,
            scores: {
              partisipasi_masyarakat: d.partisipasi_masyarakat || "",
              keragaman_paket_wisata: d.keragaman_paket_wisata || "",
              akses_tempat_wisata: d.akses_tempat_wisata || "",
              keramahan_difabel: d.keramahan_difabel || "",
              fasilitas_tempat_wisata: d.fasilitas_tempat_wisata || "",
              produk_tempat_wisata: d.produk_tempat_wisata || "",
            },
            hasScore: d.partisipasi_masyarakat !== null, // Flag untuk mengecek apakah sudah ada skor
          }));

          setVillages(processedData);
          cacheData(processedData); // Simpan ke cache
        } else {
          setError(data.message || "Gagal mengambil data");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data");
        console.error("Error fetching villages:", err);

        // Jika ada error, coba gunakan cache lama
        const cachedData = localStorage.getItem("villagesCache");
        if (cachedData) {
          try {
            const cacheObject = JSON.parse(cachedData);
            setVillages(cacheObject.data);
            setError("Menggunakan data tersimpan (offline mode)");
          } catch (cacheError) {
            console.error("Error reading old cache:", cacheError);
          }
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [token]
  );

  // Load data saat component mount
  useEffect(() => {
    if (token) {
      fetchVillages(true); // Gunakan cache
    } else {
      setInitialLoading(false);
      setError("Token tidak ditemukan");
    }
  }, [token, fetchVillages]);

  // Refresh data tanpa cache
  const refreshData = () => {
    fetchVillages(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".category-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Kategori dihasilkan dari skor, tidak bisa diubah langsung
  const changeCategory = async (villageId, newCategory) => {
    Swal.fire({
      icon: "info",
      title: "Kategori Desa",
      text: "Kategori desa dihasilkan dari skor. Silakan edit skor untuk mengubah kategori.",
      confirmButtonText: "OK",
    });
    setOpenDropdown(null);
  };

  const openEditScorePopup = (village) => {
    setCurrentVillage(village);
    setScores(
      village.scores || {
        partisipasi_masyarakat: "",
        keragaman_paket_wisata: "",
        akses_tempat_wisata: "",
        keramahan_difabel: "",
        fasilitas_tempat_wisata: "",
        produk_tempat_wisata: "",
      }
    );
    setShowPopup(true);
  };

  const handleScoreChange = (key, value) => {
    // Pastikan nilai antara 1-100
    let numValue = value === "" ? "" : parseInt(value);
    if (numValue !== "" && !isNaN(numValue)) {
      numValue = Math.max(1, Math.min(100, numValue));
    }
    setScores({ ...scores, [key]: numValue });
  };

  // Handle Save Scores - DIPERBAIKI untuk POST dan PUT
  const handleSaveScores = async () => {
    // Validasi semua field diisi
    const scoreValues = Object.values(scores);
    if (scoreValues.some((score) => score === "" || isNaN(score))) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Semua nilai skor harus diisi dengan angka antara 1-100",
      });
      return;
    }

    setLoading(true);
    try {
      // Tentukan apakah ini POST (create) atau PUT (update)
      const method = currentVillage.hasScore ? "PUT" : "POST";
      const url = currentVillage.hasScore
        ? `http://localhost:5000/api/skor/${currentVillage.id}`
        : `http://localhost:5000/api/skor`;

      const body = currentVillage.hasScore
        ? scores
        : { kd_desa: currentVillage.id, ...scores };

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Update villages state dengan data baru
        const updatedVillages = villages.map((v) =>
          v.id === currentVillage.id
            ? {
                ...v,
                score: data.rata_rata || calculateAverage(),
                category: data.kategori_desa || getCategory(calculateAverage()),
                scores: { ...scores },
                hasScore: true, // Update flag
              }
            : v
        );

        setVillages(updatedVillages);
        cacheData(updatedVillages); // Update cache
        setShowPopup(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Skor berhasil disimpan.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: data.message || "Gagal menyimpan skor",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Terjadi kesalahan saat menyimpan skor",
      });
      console.error("Error saving scores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter dan sort data
  const filteredVillages = villages
    .filter(
      (village) =>
        categoryFilter === "Semua" || village.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortFilter === "Rerata Tertinggi") return b.score - a.score;
      if (sortFilter === "Rerata Terendah") return a.score - b.score;
      if (sortFilter === "A-Z") return a.name.localeCompare(b.name);
      if (sortFilter === "Z-A") return b.name.localeCompare(a.name);
      return 0;
    });

  // Hitung rata-rata skor
  const calculateAverage = () => {
    const values = Object.values(scores).map((v) => Number(v) || 0);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  // Tentukan kategori berdasarkan rata-rata
  const getCategory = (average) => {
    if (average > 90) return "Mandiri";
    if (average >= 75) return "Maju";
    if (average >= 50) return "Berkembang";
    return "Rintisan";
  };

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab menjadi aktif, refresh data jika sudah lama
        const cached = localStorage.getItem("villagesCache");
        if (cached) {
          try {
            const cacheObject = JSON.parse(cached);
            const now = Date.now();
            // Jika cache sudah lebih dari 2 menit, refresh
            if (now - cacheObject.timestamp > 2 * 60 * 1000) {
              fetchVillages(false);
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
  }, [fetchVillages]);

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
    <div className="flex-1 overflow-x-auto md:mt-0 mt-16">
      {/* Header & Filters */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Kategori Desa Wisata</h1>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Kategori</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Urutkan</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white"
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <option value="Rerata Tertinggi">Rerata Tertinggi</option>
                <option value="Rerata Terendah">Rerata Terendah</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Info */}
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

        {/* Loading indicator */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Memuat data...
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-36">
                  Nama Desa Wisata
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-36">
                  Edit Skor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Rerata Skor
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span>Tidak ada data yang sesuai dengan filter</span>
                      <button
                        onClick={refreshData}
                        className="text-blue-500 hover:text-blue-700 text-sm underline"
                      >
                        Muat ulang data
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVillages.map((village, index) => (
                  <tr key={village.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {village.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="category-dropdown relative">
                        <button
                          onClick={() => toggleDropdown(village.id)}
                          className={`inline-flex items-center px-3 py-1 rounded text-white ${
                            village.category === "Mandiri"
                              ? "bg-green-500"
                              : village.category === "Maju"
                                ? "bg-blue-500"
                                : village.category === "Berkembang"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                          }`}
                        >
                          {village.category}
                        </button>
                        {openDropdown === village.id && (
                          <div className="absolute mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <p className="px-4 py-2 text-xs text-gray-500">
                              Kategori dihasilkan dari nilai rerata skor
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm min-w-36">
                      <button
                        onClick={() => openEditScorePopup(village)}
                        className={`inline-flex items-center px-3 py-1 text-white rounded ${
                          village.hasScore
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        <FaPencilAlt size={12} className="mr-2" />
                        {village.hasScore ? "Edit Skor" : "Tambah Skor"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {village.score || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Edit Skor */}
      {showPopup && currentVillage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {currentVillage.hasScore ? "Edit Skor" : "Tambah Skor"} -{" "}
                {currentVillage.name}
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(scores).map((key) => (
                  <div key={key}>
                    <label className="block text-sm mb-1 capitalize font-medium">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={scores[key]}
                      onChange={(e) => handleScoreChange(key, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1-100"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    Rerata Skor
                  </label>
                  <span className="text-lg font-bold">
                    {calculateAverage()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Kategori Prediksi:
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium text-white ${
                      getCategory(calculateAverage()) === "Mandiri"
                        ? "bg-green-500"
                        : getCategory(calculateAverage()) === "Maju"
                          ? "bg-blue-500"
                          : getCategory(calculateAverage()) === "Berkembang"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                  >
                    {getCategory(calculateAverage())}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleSaveScores}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

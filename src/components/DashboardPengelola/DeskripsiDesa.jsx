import { useState, useRef, useContext, useEffect } from "react";
import {
  FiUpload,
  FiPlusCircle,
  FiTrash2,
  FiSave,
  FiX,
  FiMapPin,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import profile from "../../assets/Dashboard/profile.svg";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const DeskripsiDesa = () => {
  const { user } = useContext(UserContext);

  // State for user's desa data
  const [userDesa, setUserDesa] = useState(null);
  const [existingDeskripsi, setExistingDeskripsi] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // State for form fields
  const [formData, setFormData] = useState({
    lokasiDesa: "",
    deskripsiDesa: "",
    fasilitas: [""],
    videoURLs: [""],
    coverImage: null,
    galleryImages: [],
    jenisDesa: [],
    latitude: null,
    longitude: null,
  });

  // Refs for file inputs
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Fetch user's desa data
  useEffect(() => {
    const fetchUserDesa = async () => {
      if (!user?.data?.email) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`api/desa-wisata/email/${user.data.email}`);

        if (response.data.status === "success" && response.data.data.length > 0) {
          const desaData = response.data.data[0]; // Ambil desa pertama (karena 1 user = 1 desa)
          setUserDesa(desaData);

          // Fetch existing deskripsi if available
          try {
            const deskripsiResponse = await axiosInstance.get(`api/deskripsi-desa/${desaData.kd_desa}`);
            if (deskripsiResponse.data.status === "success") {
              const deskripsi = deskripsiResponse.data.data;
              setExistingDeskripsi(deskripsi);
              setIsEditing(true);              // Populate form with existing data
              setFormData({
                ...formData,
                lokasiDesa: deskripsi.lokasi_desa || "",
                deskripsiDesa: deskripsi.deskripsi_desa || "",
                fasilitas: deskripsi.fasilitas_desa?.length > 0 ? deskripsi.fasilitas_desa : [""],
                videoURLs: deskripsi.url_video?.length > 0 ? deskripsi.url_video : [""],
                coverImage: deskripsi.gambar_cover || null,
                galleryImages: deskripsi.galeri_desa || [],
                jenisDesa: deskripsi.jenis_desa || [], // ← Tambahkan baris ini
                latitude: deskripsi.latitude ? Number(deskripsi.latitude) : null,
                longitude: deskripsi.longitude ? Number(deskripsi.longitude) : null,
              });
            }
          } catch (deskripsiError) {
            // Deskripsi belum ada, user bisa membuat baru
            console.log("Deskripsi belum ada, bisa membuat baru");
            setIsEditing(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user desa:", error);
        if (error.response?.status === 404) {
          Swal.fire({
            icon: "warning",
            title: "Desa Wisata Tidak Ditemukan",
            text: "Anda belum memiliki desa wisata. Silakan hubungi administrator.",
            confirmButtonColor: "#3085d6",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDesa();
  }, [user]);

  // Handle cover image upload
  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi ukuran file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Ukuran file terlalu besar. Maksimal 5MB.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          coverImage: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery images upload
  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 8) {
      Swal.fire({
        icon: "warning",
        title: "Terlalu Banyak File",
        text: "Maksimal 8 gambar untuk galeri.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (files.length > 0) {
      const newImages = [];
      let processedCount = 0;

      files.forEach((file) => {
        // Validasi ukuran file
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: "error",
            title: "File Terlalu Besar",
            text: `File ${file.name} terlalu besar. Maksimal 5MB per file.`,
            confirmButtonColor: "#3085d6",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          processedCount++;

          // If we've processed all valid files, update state
          if (processedCount === files.filter((f) => f.size <= 5 * 1024 * 1024).length) {
            setFormData({
              ...formData,
              galleryImages: [...formData.galleryImages, ...newImages],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle drag and drop for cover
  const handleCoverDragOver = (event) => {
    event.preventDefault();
  };

  const handleCoverDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Ukuran file terlalu besar. Maksimal 5MB.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          coverImage: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop for gallery
  const handleGalleryDragOver = (event) => {
    event.preventDefault();
  };

  const handleGalleryDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 8) {
      Swal.fire({
        icon: "warning",
        title: "Terlalu Banyak File",
        text: "Maksimal 8 gambar untuk galeri.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (files.length > 0) {
      const newImages = [];
      let processedCount = 0;

      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: "error",
            title: "File Terlalu Besar",
            text: `File ${file.name} terlalu besar. Maksimal 5MB per file.`,
            confirmButtonColor: "#3085d6",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          processedCount++;

          if (processedCount === files.filter((f) => f.size <= 5 * 1024 * 1024).length) {
            setFormData({
              ...formData,
              galleryImages: [...formData.galleryImages, ...newImages],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add new video URL field
  const addVideoURL = () => {
    setFormData({
      ...formData,
      videoURLs: [...formData.videoURLs, ""],
    });
  };

  // Update video URL
  const updateVideoURL = (index, value) => {
    const updatedURLs = [...formData.videoURLs];
    updatedURLs[index] = value;
    setFormData({
      ...formData,
      videoURLs: updatedURLs,
    });
  };

  // Remove video URL
  const removeVideoURL = (index) => {
    if (formData.videoURLs.length > 1) {
      const updatedURLs = [...formData.videoURLs];
      updatedURLs.splice(index, 1);
      setFormData({
        ...formData,
        videoURLs: updatedURLs,
      });
    }
  };

  // Handle fasilitas input change
  const updateFasilitas = (index, value) => {
    const updatedFasilitas = [...formData.fasilitas];
    updatedFasilitas[index] = value;
    setFormData({
      ...formData,
      fasilitas: updatedFasilitas,
    });
  };

  // Add new fasilitas field
  const addFasilitas = () => {
    setFormData({
      ...formData,
      fasilitas: [...formData.fasilitas, ""],
    });
  };

  // Remove fasilitas
  const removeFasilitas = (index) => {
    if (formData.fasilitas.length > 1) {
      const updatedFasilitas = [...formData.fasilitas];
      updatedFasilitas.splice(index, 1);
      setFormData({
        ...formData,
        fasilitas: updatedFasilitas,
      });
    }
  };

  // Remove a gallery image
  const removeGalleryImage = (index) => {
    const updatedImages = [...formData.galleryImages];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      galleryImages: updatedImages,
    });
  };

  // Convert data URL to File object
  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDesa) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Ditemukan",
        text: "Data desa tidak ditemukan.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Prepare form data for multipart upload
      const submitFormData = new FormData();

      // Prepare data object - DIFFERENT for POST vs PUT
      let dataToSubmit;

      if (existingDeskripsi) {        // For PUT request - DON'T include kd_desa since it's in the route
        dataToSubmit = {
          lokasi_desa: formData.lokasiDesa,
          deskripsi_desa: formData.deskripsiDesa,
          fasilitas_desa: formData.fasilitas.filter((f) => f.trim() !== ""),
          url_video: formData.videoURLs.filter((url) => url.trim() !== ""),
          jenis_desa: formData.jenisDesa,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };
        const keepGalleryImages = formData.galleryImages.filter((img) => !img.startsWith("data:"));
        dataToSubmit.keep_gallery_images = keepGalleryImages;
      } else {        // For POST request - include kd_desa
        dataToSubmit = {
          kd_desa: userDesa.kd_desa,
          lokasi_desa: formData.lokasiDesa,
          deskripsi_desa: formData.deskripsiDesa,
          fasilitas_desa: formData.fasilitas.filter((f) => f.trim() !== ""),
          url_video: formData.videoURLs.filter((url) => url.trim() !== ""),
          jenis_desa: formData.jenisDesa,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };
      }

      submitFormData.append("data", JSON.stringify(dataToSubmit));

      // Handle cover image
      if (formData.coverImage && formData.coverImage.startsWith("data:")) {
        const coverFile = dataURLtoFile(formData.coverImage, "cover-image.jpg");
        submitFormData.append("gambar_cover", coverFile);
      }

      // Handle gallery images
      formData.galleryImages.forEach((image, index) => {
        if (image.startsWith("data:")) {
          const galleryFile = dataURLtoFile(image, `gallery-image-${index}.jpg`);
          submitFormData.append("galeri_desa", galleryFile);
        }
      });

      let response;

      if (existingDeskripsi) {
        // Update existing deskripsi
        response = await axiosInstance.put(`api/deskripsi-desa/${userDesa.kd_desa}`, submitFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new deskripsi
        response = await axiosInstance.post("api/deskripsi-desa", submitFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: existingDeskripsi ? "Deskripsi desa berhasil diperbarui!" : "Deskripsi desa berhasil ditambahkan!",
          confirmButtonColor: "#3085d6",
        });

        // Update state with new data
        setExistingDeskripsi(response.data.data);
        setIsEditing(true);        // Update form data with returned URLs
        const updatedData = response.data.data;
        setFormData({
          ...formData,
          coverImage: updatedData.gambar_cover || null,
          galleryImages: updatedData.galeri_desa || [],
          latitude: updatedData.latitude ? Number(updatedData.latitude) : null,
          longitude: updatedData.longitude ? Number(updatedData.longitude) : null,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete deskripsi
  const handleDeleteDeskripsi = async () => {
    if (!existingDeskripsi || !userDesa) return;

    if (!window.confirm("Apakah Anda yakin ingin menghapus deskripsi desa ini? Semua data dan gambar akan dihapus permanen.")) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await axiosInstance.delete(`api/deskripsi-desa/${userDesa.kd_desa}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Deskripsi desa berhasil dihapus!",
          confirmButtonColor: "#3085d6",
        });        // Reset state
        setExistingDeskripsi(null);
        setIsEditing(false);
        setFormData({
          lokasiDesa: "",
          deskripsiDesa: "",
          fasilitas: [""],
          videoURLs: [""],
          coverImage: null,
          galleryImages: [],
          latitude: null,
          longitude: null,
        });
      }
    } catch (error) {
      console.error("Error deleting deskripsi:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error.response?.data?.message || "Terjadi kesalahan saat menghapus data.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Icons for fasilitas
  const fasilitasIcons = {
    "Areal Parkir": "🅿️",
    "Jungle Tracking": "🌲",
    "Kamar Mandi Umum": "🚻",
    Mushola: "🕌",
    "Selfie Area": "📸",
    "Spot Foto": "📷",
  };

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          latitude: lat,
          longitude: lng,
        });
        Swal.fire({
          icon: "success",
          title: "Lokasi Dipilih!",
          text: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
    });
    return null;
  };

  // Handle coordinate input change
  const handleCoordinateChange = (field, value) => {
    const numValue = parseFloat(value);
    if (field === "latitude") {
      if (isNaN(numValue) || numValue < -90 || numValue > 90) {
        if (value !== "") {
          Swal.fire({
            icon: "error",
            title: "Koordinat Tidak Valid",
            text: "Latitude harus antara -90 dan 90",
            confirmButtonColor: "#3085d6",
          });
        }
        return;
      }
    } else if (field === "longitude") {
      if (isNaN(numValue) || numValue < -180 || numValue > 180) {
        if (value !== "") {
          Swal.fire({
            icon: "error",
            title: "Koordinat Tidak Valid",
            text: "Longitude harus antara -180 dan 180",
            confirmButtonColor: "#3085d6",
          });
        }
        return;
      }
    }
    
    setFormData({
      ...formData,
      [field]: value === "" ? null : numValue,
    });
  };
  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "Geolocation Tidak Didukung",
        text: "Browser Anda tidak mendukung geolocation",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Show loading message
    Swal.fire({
      title: 'Mendapatkan Lokasi...',
      text: 'Mohon tunggu sementara kami mendapatkan lokasi Anda',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          latitude,
          longitude,
        });
        Swal.fire({
          icon: "success",
          title: "Lokasi Ditemukan!",
          text: `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          confirmButtonColor: "#3085d6",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Pastikan Anda mengizinkan akses lokasi";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser dan coba lagi.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia. Pastikan GPS aktif dan koneksi internet stabil.";
            break;
          case error.TIMEOUT:
            errorMessage = "Waktu habis saat mencari lokasi. Silakan coba lagi.";
            break;
          default:
            errorMessage = "Terjadi kesalahan saat mendapatkan lokasi. Silakan coba lagi.";
            break;
        }
          Swal.fire({
          icon: "error",
          title: "Gagal Mendapatkan Lokasi",
          text: errorMessage,
          confirmButtonColor: "#3085d6",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-x-auto p-6 bg-gray-50 md:mt-0 mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Memuat data desa...</div>
        </div>
      </div>
    );
  }

  if (!userDesa) {
    return (
      <div className="flex-1 overflow-x-auto p-6 bg-gray-50 md:mt-0 mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">Desa Wisata Tidak Ditemukan</div>
            <div className="text-sm text-gray-500">Anda belum memiliki desa wisata yang terdaftar. Silakan hubungi administrator.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-gray-50 md:mt-0 mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Deskripsi Desa</h1>
          <p className="text-gray-600 mt-1">{userDesa.nama_desa}</p>
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

      {/* Action buttons */}
      {existingDeskripsi && (
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={handleDeleteDeskripsi}
            disabled={submitting}
            className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 disabled:opacity-50 flex items-center"
          >
            <FiTrash2 className="mr-2" />
            Hapus Deskripsi
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400"
            onClick={() => coverInputRef.current.click()}
            onDragOver={handleCoverDragOver}
            onDrop={handleCoverDrop}
          >
            {formData.coverImage ? (
              <div className="w-full relative">
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, coverImage: null });
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-sm text-center text-gray-500">
                  Unggah file atau seret ke sini
                </p>
                <p className="text-xs text-center text-gray-400 mt-1">
                  JPEG, JPG, PNG (5MB, 1440×506px)
                </p>
              </>
            )}
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverUpload}
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
            />
          </div>
        </div>

        {/* Lokasi Desa */}
        <div className="mb-6">
          <label
            htmlFor="lokasiDesa"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <FiMapPin className="inline mr-1" />
            Lokasi Desa
          </label>
          <input
            type="text"
            id="lokasiDesa"
            value={formData.lokasiDesa}
            onChange={(e) =>
              setFormData({ ...formData, lokasiDesa: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Jl. Raya Desa No. 123, Kecamatan ABC, Kabupaten XYZ"
          />
          <p className="text-xs text-gray-500 mt-1">
            Masukkan alamat lengkap atau koordinat lokasi desa wisata
          </p>
        </div>

        {/* Deskripsi Desa Wisata */}
        <div className="mb-6">
          <label
            htmlFor="deskripsiDesa"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Deskripsi Desa Wisata
          </label>
          <textarea
            id="deskripsiDesa"
            value={formData.deskripsiDesa}
            onChange={(e) =>
              setFormData({ ...formData, deskripsiDesa: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            placeholder="Ceritakan tentang desa wisata Anda..."
          />
        </div>

        {/* Jenis Desa Wisata */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Desa Wisata
          </label>
          <div className="space-y-2">
            {["alam", "budaya", "buatan"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.jenisDesa.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        jenisDesa: [...formData.jenisDesa, type],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        jenisDesa: formData.jenisDesa.filter((t) => t !== type),
                      });
                    }
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fasilitas Desa Wisata */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fasilitas Desa Wisata
          </label>
          <div className="space-y-2">
            {formData.fasilitas.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                  {fasilitasIcons[item] || "•"}
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateFasilitas(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama fasilitas"
                />
                {formData.fasilitas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFasilitas(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            ))}
            <div className="mt-2">
              <button
                type="button"
                onClick={addFasilitas}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FiPlusCircle className="mr-1" /> Tambah Fasilitas
              </button>
            </div>
          </div>
        </div>

        {/* URL Video / Youtube */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Video / Youtube
          </label>
          <div className="space-y-2">
            {formData.videoURLs.map((url, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateVideoURL(index, e.target.value)}
                  placeholder="https://www.youtube.com/..."
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.videoURLs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVideoURL(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={addVideoURL}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg p-2 text-gray-500 hover:bg-gray-50"
            >
              <FiPlusCircle className="mr-2" /> Tambah URL Video
            </button>
          </div>
        </div>

        {/* Koordinat Lokasi */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMapPin className="inline mr-1" />
            Pinpoint Desa
          </label>

          {/* Coordinate Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={formData.latitude || ""}
                onChange={(e) =>
                  handleCoordinateChange("latitude", e.target.value)
                }
                placeholder="-7.8753849"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={formData.longitude || ""}
                onChange={(e) =>
                  handleCoordinateChange("longitude", e.target.value)
                }
                placeholder="110.4262088"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Get Current Location Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FiMapPin className="mr-2" />
              Gunakan Lokasi Saat Ini
            </button>
          </div>

          {/* Interactive Map */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div style={{ height: "400px", width: "100%" }}>
              <MapContainer
                center={[
                  formData.latitude || -7.8753849,
                  formData.longitude || 110.4262088,
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />{" "}
                {formData.latitude && formData.longitude && (
                  <Marker position={[formData.latitude, formData.longitude]}>
                    <Popup>
                      Lokasi Desa: {userDesa?.nama_desa}
                      <br />
                      Koordinat: {Number(formData.latitude).toFixed(6)},{" "}
                      {Number(formData.longitude).toFixed(6)}
                    </Popup>
                  </Marker>
                )}
                <MapClickHandler />
              </MapContainer>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Klik pada peta untuk menentukan lokasi desa, atau masukkan koordinat
            secara manual.
          </p>
        </div>

        {/* Galeri */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Galeri
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer mb-4 hover:border-blue-400"
            onClick={() => galleryInputRef.current.click()}
            onDragOver={handleGalleryDragOver}
            onDrop={handleGalleryDrop}
          >
            <FiUpload className="text-gray-400 text-3xl mb-2" />
            <p className="text-sm text-center text-gray-500">
              Unggah file atau seret ke sini
            </p>
            <p className="text-xs text-center text-gray-400 mt-1">
              JPEG, JPG, PNG (5MB, 1440×506px, maks 8 file)
            </p>
            <input
              type="file"
              ref={galleryInputRef}
              onChange={handleGalleryUpload}
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              multiple
            />
          </div>

          {/* Gallery Preview */}
          {formData.galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            <FiSave className="mr-2" />
            {submitting
              ? "Menyimpan..."
              : existingDeskripsi
                ? "Update"
                : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

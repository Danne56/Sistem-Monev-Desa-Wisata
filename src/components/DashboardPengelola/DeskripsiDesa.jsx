import React, { useState, useRef, useContext, useEffect } from "react";
import {
  FiUpload,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";
import profile from "../../assets/Dashboard/profile.svg";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";

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
        const response = await axiosInstance.get(
          `api/desa-wisata/email/${user.data.email}`
        );

        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          const desaData = response.data.data[0]; // Ambil desa pertama (karena 1 user = 1 desa)
          setUserDesa(desaData);

          // Fetch existing deskripsi if available
          try {
            const deskripsiResponse = await axiosInstance.get(
              `api/deskripsi-desa/${desaData.kd_desa}`
            );
            if (deskripsiResponse.data.status === "success") {
              const deskripsi = deskripsiResponse.data.data;
              setExistingDeskripsi(deskripsi);
              setIsEditing(true);

              // Populate form with existing data
              setFormData({
                lokasiDesa: deskripsi.lokasi_desa || "",
                deskripsiDesa: deskripsi.deskripsi_desa || "",
                fasilitas:
                  deskripsi.fasilitas_desa?.length > 0
                    ? deskripsi.fasilitas_desa
                    : [""],
                videoURLs:
                  deskripsi.url_video?.length > 0 ? deskripsi.url_video : [""],
                coverImage: deskripsi.gambar_cover || null,
                galleryImages: deskripsi.galeri_desa || [],
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
          alert(
            "Anda belum memiliki desa wisata. Silakan hubungi administrator."
          );
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
        alert("Ukuran file terlalu besar. Maksimal 5MB.");
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
      alert("Maksimal 8 gambar untuk galeri.");
      return;
    }

    if (files.length > 0) {
      const newImages = [];
      let processedCount = 0;

      files.forEach((file) => {
        // Validasi ukuran file
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} terlalu besar. Maksimal 5MB per file.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          processedCount++;

          // If we've processed all valid files, update state
          if (
            processedCount ===
            files.filter((f) => f.size <= 5 * 1024 * 1024).length
          ) {
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
        alert("Ukuran file terlalu besar. Maksimal 5MB.");
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
      alert("Maksimal 8 gambar untuk galeri.");
      return;
    }

    if (files.length > 0) {
      const newImages = [];
      let processedCount = 0;

      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} terlalu besar. Maksimal 5MB per file.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          processedCount++;

          if (
            processedCount ===
            files.filter((f) => f.size <= 5 * 1024 * 1024).length
          ) {
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
      alert("Data desa tidak ditemukan.");
      return;
    }

    setSubmitting(true);

    try {
      // Prepare form data for multipart upload
      const submitFormData = new FormData();

      // Prepare data object - DIFFERENT for POST vs PUT
      let dataToSubmit;
      
      if (existingDeskripsi) {
        // For PUT request - DON'T include kd_desa since it's in the route
        dataToSubmit = {
          lokasi_desa: formData.lokasiDesa,
          deskripsi_desa: formData.deskripsiDesa,
          fasilitas_desa: formData.fasilitas.filter((f) => f.trim() !== ""),
          url_video: formData.videoURLs.filter((url) => url.trim() !== ""),
        };
      } else {
        // For POST request - include kd_desa
        dataToSubmit = {
          kd_desa: userDesa.kd_desa,
          lokasi_desa: formData.lokasiDesa,
          deskripsi_desa: formData.deskripsiDesa,
          fasilitas_desa: formData.fasilitas.filter((f) => f.trim() !== ""),
          url_video: formData.videoURLs.filter((url) => url.trim() !== ""),
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
          const galleryFile = dataURLtoFile(
            image,
            `gallery-image-${index}.jpg`
          );
          submitFormData.append("galeri_desa", galleryFile);
        }
      });

      let response;

      if (existingDeskripsi) {
        // Update existing deskripsi
        response = await axiosInstance.put(
          `api/deskripsi-desa/${userDesa.kd_desa}`,
          submitFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new deskripsi
        response = await axiosInstance.post(
          "api/deskripsi-desa",
          submitFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.status === "success") {
        alert(
          existingDeskripsi
            ? "Deskripsi desa berhasil diperbarui!"
            : "Deskripsi desa berhasil ditambahkan!"
        );

        // Update state with new data
        setExistingDeskripsi(response.data.data);
        setIsEditing(true);

        // Update form data with returned URLs
        const updatedData = response.data.data;
        setFormData({
          ...formData,
          coverImage: updatedData.gambar_cover || null,
          galleryImages: updatedData.galeri_desa || [],
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete deskripsi
  const handleDeleteDeskripsi = async () => {
    if (!existingDeskripsi || !userDesa) return;

    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus deskripsi desa ini? Semua data dan gambar akan dihapus permanen."
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await axiosInstance.delete(
        `api/deskripsi-desa/${userDesa.kd_desa}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        alert("Deskripsi desa berhasil dihapus!");

        // Reset state
        setExistingDeskripsi(null);
        setIsEditing(false);
        setFormData({
          lokasiDesa: "",
          deskripsiDesa: "",
          fasilitas: [""],
          videoURLs: [""],
          coverImage: null,
          galleryImages: [],
        });
      }
    } catch (error) {
      console.error("Error deleting deskripsi:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data."
      );
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
            <div className="text-lg font-semibold text-gray-600 mb-2">
              Desa Wisata Tidak Ditemukan
            </div>
            <div className="text-sm text-gray-500">
              Anda belum memiliki desa wisata yang terdaftar. Silakan hubungi
              administrator.
            </div>
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
          <p className="text-gray-600 mt-1">
            {userDesa.nama_desa} ({userDesa.kd_desa})
          </p>
        </div>
        <div className="flex items-center">
          <div className="mr-2 text-right">
            <div className="font-semibold">{user?.data.fullname}</div>
            <div className="text-sm text-gray-500">{user?.data.role}</div>
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
                  Upload a file or drag and drop
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
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            placeholder="Ceritakan tentang desa wisata Anda..."
          />
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
              Upload a file or drag and drop
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
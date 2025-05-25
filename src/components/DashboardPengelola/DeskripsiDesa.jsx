import React, { useState, useRef, useContext } from "react";
import { FiUpload, FiPlusCircle } from "react-icons/fi";
import profile from "../../assets/Dashboard/profile.svg";
import { UserContext } from "../../context/UserContext";

export const DeskripsiDesa = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    namaDesa: "",
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

  // Handle cover image upload
  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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
    if (files.length > 0) {
      const newImages = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          // If we've processed all files, update state
          if (newImages.length === files.length) {
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
    if (files.length > 0) {
      const newImages = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          // If we've processed all files, update state
          if (newImages.length === files.length) {
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

  // Remove a gallery image
  const removeGalleryImage = (index) => {
    const updatedImages = [...formData.galleryImages];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      galleryImages: updatedImages,
    });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your API
  };

  // Icons for fasilitas
  const fasilitasIcons = {
    "Areal Parkir": "P",
    "Jungle Tracking": "🌲",
    "Kamar Mandi Umum": "🚻",
    Mushola: "🕌",
    "Selfie Area": "📸",
    "Spot Foto": "📷",
  };

  const { user } = useContext(UserContext);

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-gray-50 md:mt-0 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deskripsi Desa</h1>
        <div className="flex items-center">
          <div className="mr-2 text-right">
            <div className="font-semibold">{user?.data.fullname}</div>
            <div className="text-sm text-gray-500">{user?.data.role}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
            <img src={profile} alt="Profile" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => coverInputRef.current.click()}
            onDragOver={handleCoverDragOver}
            onDrop={handleCoverDrop}
          >
            {formData.coverImage ? (
              <div className="w-full relative">
                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-64 object-cover rounded-lg" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, coverImage: null });
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-sm text-center text-gray-500">Upload a file or drag and drop</p>
                <p className="text-xs text-center text-gray-400 mt-1">JPEG, JPG, PNG (5MB, 1440×506px)</p>
              </>
            )}
            <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/jpeg,image/jpg,image/png" className="hidden" />
          </div>
        </div>

        {/* Nama Desa Wisata */}
        <div className="mb-6">
          <label htmlFor="namaDesa" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Desa Wisata
          </label>
          <input type="text" id="namaDesa" value={formData.namaDesa} onChange={(e) => setFormData({ ...formData, namaDesa: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2" />
        </div>

        {/* Lokasi Desa Wisata */}
        <div className="mb-6">
          <label htmlFor="lokasiDesa" className="block text-sm font-medium text-gray-700 mb-2">
            Lokasi Desa Wisata
          </label>
          <input type="text" id="lokasiDesa" value={formData.lokasiDesa} onChange={(e) => setFormData({ ...formData, lokasiDesa: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2" />
        </div>

        {/* Deskripsi Desa Wisata */}
        <div className="mb-6">
          <label htmlFor="deskripsiDesa" className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Desa Wisata
          </label>
          <textarea id="deskripsiDesa" value={formData.deskripsiDesa} onChange={(e) => setFormData({ ...formData, deskripsiDesa: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2" rows={5} />
        </div>

        {/* Fasilitas Desa Wisata */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas Desa Wisata</label>
          <div className="space-y-2">
            {formData.fasilitas.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-2">{fasilitasIcons[item] || "•"}</div>
                <input type="text" value={item} onChange={(e) => updateFasilitas(index, e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
            ))}
            <div className="mt-2">
              <button type="button" onClick={addFasilitas} className="flex items-center text-blue-500 hover:text-blue-700">
                <FiPlusCircle className="mr-1" /> Tambah Fasilitas
              </button>
            </div>
          </div>
        </div>

        {/* URL Video / Youtube */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">URL Video / Youtube</label>
          <div className="space-y-2">
            {formData.videoURLs.map((url, index) => (
              <input key={index} type="text" value={url} onChange={(e) => updateVideoURL(index, e.target.value)} placeholder="https://www.youtube.com/..." className="w-full border border-gray-300 rounded-lg p-2" />
            ))}
          </div>
          <div className="mt-2">
            <button type="button" onClick={addVideoURL} className="flex items-center justify-center w-full border border-gray-300 rounded-lg p-2 text-gray-500 hover:bg-gray-50">
              <FiPlusCircle className="mr-2" /> Tambah URL Video
            </button>
          </div>
        </div>

        {/* Galeri */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Galeri</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer mb-4"
            onClick={() => galleryInputRef.current.click()}
            onDragOver={handleGalleryDragOver}
            onDrop={handleGalleryDrop}
          >
            <FiUpload className="text-gray-400 text-3xl mb-2" />
            <p className="text-sm text-center text-gray-500">Upload a file or drag and drop</p>
            <p className="text-xs text-center text-gray-400 mt-1">JPEG, JPG, PNG (nMB, 1440×506px, maks 8 file)</p>
            <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/jpeg,image/jpg,image/png" className="hidden" multiple />
          </div>

          {/* Gallery Preview */}
          {formData.galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center" onClick={() => removeGalleryImage(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* <div className="mt-4">
            <button type="button" onClick={() => galleryInputRef.current.click()} className="flex items-center justify-center w-full border border-gray-300 rounded-lg p-2 text-gray-500 hover:bg-gray-50">
              <FiPlusCircle className="mr-2" /> Tambah Foto/Galeri
            </button>
          </div> */}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

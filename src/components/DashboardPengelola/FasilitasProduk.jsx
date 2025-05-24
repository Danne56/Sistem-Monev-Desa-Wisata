import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaPlus, FaTimes, FaImage, FaTrashAlt, FaEdit } from "react-icons/fa";
import profile from "../../assets/Dashboard/profile.svg";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";

const FasilitasProduk = () => {
  const MySwal = withReactContent(Swal);
  const { user } = useContext(UserContext);

  // State untuk data
  const [atraksi, setAtraksi] = useState([]);
  const [penginapan, setPenginapan] = useState([]);
  const [paketWisata, setPaketWisata] = useState([]);
  const [souvenir, setSouvenir] = useState([]);
  const [kdDesa, setKdDesa] = useState("");
  const [namaDesa, setNamaDesa] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Ambil kd_desa dari desa_wisata
  useEffect(() => {
    const fetchDesaWisata = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/desa-wisata/email/${user?.data.email}`
        );
        if (response.data.status === "success") {
          const desa = response.data.data[0];
          setKdDesa(desa.kd_desa);
          setNamaDesa(desa.nama_desa);

          // Fetch deskripsi wisata
          const deskripsiResponse = await axiosInstance.get(
            `/api/deskripsi-wisata/${desa.kd_desa}`
          );
          const deskripsiData = deskripsiResponse.data.data || {};

          setAtraksi(
            typeof deskripsiData.atraksi === "string"
              ? JSON.parse(deskripsiData.atraksi)
              : deskripsiData.atraksi || []
          );
          setPenginapan(
            typeof deskripsiData.penginapan === "string"
              ? JSON.parse(deskripsiData.penginapan)
              : deskripsiData.penginapan || []
          );
          setPaketWisata(
            typeof deskripsiData.paket_wisata === "string"
              ? JSON.parse(deskripsiData.paket_wisata)
              : deskripsiData.paket_wisata || []
          );
          setSouvenir(
            typeof deskripsiData.suvenir === "string"
              ? JSON.parse(deskripsiData.suvenir)
              : deskripsiData.suvenir || []
          );
        }
      } catch (err) {
        console.error("Gagal mengambil data desa:", err);
      }
    };

    fetchDesaWisata();
  }, []);

  // Form input states
  const [newAtraksi, setNewAtraksi] = useState({
    nama: "",
    gambar: null,
    gambarFile: null,
  });
  const [newPenginapan, setNewPenginapan] = useState({
    nama: "",
    harga: "",
    gambar: null,
    gambarFile: null,
  });
  const [newPaketWisata, setNewPaketWisata] = useState({
    nama: "",
    harga: "",
    gambar: null,
    gambarFile: null,
  });
  const [newSouvenir, setNewSouvenir] = useState({
    nama: "",
    harga: "",
    gambar: null,
    gambarFile: null,
  });

  // Fungsi untuk upload gambar ke GCS
  const uploadGambarKeGCS = async (file) => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        "/api/upload/gambar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Perbaikan: Sesuaikan dengan struktur respons yang sebenarnya
      // Cek beberapa kemungkinan struktur respons
      if (response.data.url) {
        return response.data.url; // Jika respons langsung berisi url
      } else if (response.data.data && response.data.data.url) {
        return response.data.data.url; // Jika respons memiliki struktur { data: { url } }
      } else {
        console.error("Struktur respons tidak dikenali:", response.data);
        throw new Error("Struktur respons tidak valid");
      }
    } catch (error) {
      console.error("Gagal upload gambar:", error);
      MySwal.fire({
        title: "Error",
        text: error.response?.data?.message || "Gagal mengupload gambar",
        icon: "error",
      });
      return null;
    }
  };

  // Handler tambah item dengan SweetAlert
  const handleTambahItem = async (type) => {
    let newItem;
    let setter;

    switch (type) {
      case "atraksi":
        if (!newAtraksi.nama.trim()) return;
        newItem = newAtraksi;
        setter = setAtraksi;
        break;
      case "penginapan":
        if (!newPenginapan.nama.trim() || !newPenginapan.harga.trim()) return;
        newItem = newPenginapan;
        setter = setPenginapan;
        break;
      case "paketWisata":
        if (!newPaketWisata.nama.trim() || !newPaketWisata.harga.trim()) return;
        newItem = newPaketWisata;
        setter = setPaketWisata;
        break;
      case "souvenir":
        if (!newSouvenir.nama.trim() || !newSouvenir.harga.trim()) return;
        newItem = newSouvenir;
        setter = setSouvenir;
        break;
      default:
        return;
    }

    const confirm = await MySwal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menambahkan ${type}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      setIsUploading(true);
      try {
        const items =
          type === "atraksi"
            ? atraksi
            : type === "penginapan"
              ? penginapan
              : type === "paketWisata"
                ? paketWisata
                : souvenir;

        const newId =
          items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;

        // Upload gambar jika ada
        let gambarUrl = newItem.gambar;
        if (newItem.gambarFile) {
          gambarUrl = await uploadGambarKeGCS(newItem.gambarFile);
          if (!gambarUrl) return; // Jika upload gagal, berhenti
        }

        const itemToSave = {
          id: newId,
          nama: newItem.nama,
          ...(newItem.harga && { harga: newItem.harga }),
          gambar: gambarUrl,
        };

        // Simpan ke state lokal
        setter([...items, itemToSave]);
        resetForm(type);

        // Simpan ke database
        await simpanKeDatabase(itemToSave, type);

        MySwal.fire("Berhasil!", `${type} berhasil ditambahkan`, "success");
      } catch (error) {
        console.error(`Gagal menambahkan ${type}:`, error);
        MySwal.fire("Gagal", `Gagal menambahkan ${type}`, "error");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const resetForm = (type) => {
    switch (type) {
      case "atraksi":
        setNewAtraksi({ nama: "", harga: "", gambar: null, gambarFile: null });
        break;
      case "penginapan":
        setNewPenginapan({
          nama: "",
          harga: "",
          gambar: null,
          gambarFile: null,
        });
        break;
      case "paketWisata":
        setNewPaketWisata({
          nama: "",
          harga: "",
          gambar: null,
          gambarFile: null,
        });
        break;
      case "souvenir":
        setNewSouvenir({ nama: "", harga: "", gambar: null, gambarFile: null });
        break;
    }
  };

  // Handler hapus item
  const handleHapusItem = async (id, type) => {
    const confirm = await MySwal.fire({
      title: "Konfirmasi Hapus",
      text: "Anda yakin ingin menghapus item ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      setIsUploading(true);
      try {
        // Cari item yang akan dihapus
        let items, itemToDelete;
        switch (type) {
          case "atraksi":
            items = atraksi;
            itemToDelete = atraksi.find((item) => item.id === id);
            setAtraksi(atraksi.filter((item) => item.id !== id));
            break;
          case "penginapan":
            items = penginapan;
            itemToDelete = penginapan.find((item) => item.id === id);
            setPenginapan(penginapan.filter((item) => item.id !== id));
            break;
          case "paketWisata":
            items = paketWisata;
            itemToDelete = paketWisata.find((item) => item.id === id);
            setPaketWisata(paketWisata.filter((item) => item.id !== id));
            break;
          case "souvenir":
            items = souvenir;
            itemToDelete = souvenir.find((item) => item.id === id);
            setSouvenir(souvenir.filter((item) => item.id !== id));
            break;
          default:
            break;
        }

        if (itemToDelete) {
          // Hapus dari database
          await hapusDariDatabase(itemToDelete.id, type);
          MySwal.fire("Dihapus!", "Item berhasil dihapus.", "success");
        }
      } catch (error) {
        console.error(`Gagal menghapus ${type}:`, error);
        MySwal.fire("Gagal", "Gagal menghapus item", "error");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handler update item
  const handleUpdateItem = async (updatedItem, type) => {
    setIsUploading(true);
    try {
      // Upload gambar baru jika ada
      let gambarUrl = updatedItem.gambar;
      if (updatedItem.gambarFile) {
        gambarUrl = await uploadGambarKeGCS(updatedItem.gambarFile);
        if (!gambarUrl) return; // Jika upload gagal, berhenti
      }

      const updatedData = {
        ...updatedItem,
        gambar: gambarUrl,
      };

      // Update state lokal
      switch (type) {
        case "atraksi":
          setAtraksi(
            atraksi.map((item) =>
              item.id === updatedItem.id ? updatedData : item
            )
          );
          break;
        case "penginapan":
          setPenginapan(
            penginapan.map((item) =>
              item.id === updatedItem.id ? updatedData : item
            )
          );
          break;
        case "paketWisata":
          setPaketWisata(
            paketWisata.map((item) =>
              item.id === updatedItem.id ? updatedData : item
            )
          );
          break;
        case "souvenir":
          setSouvenir(
            souvenir.map((item) =>
              item.id === updatedItem.id ? updatedData : item
            )
          );
          break;
        default:
          break;
      }

      // Update di database
      await updateDiDatabase(updatedData, type);

      MySwal.fire("Berhasil!", "Item berhasil diperbarui", "success");
    } catch (error) {
      console.error(`Gagal memperbarui ${type}:`, error);
      MySwal.fire("Gagal", "Gagal memperbarui item", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Upload gambar handler
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Buat URL preview
    const previewUrl = URL.createObjectURL(file);

    // Simpan file dan preview URL ke state
    switch (type) {
      case "atraksi":
        setNewAtraksi((prev) => ({
          ...prev,
          gambar: previewUrl,
          gambarFile: file,
        }));
        break;
      case "penginapan":
        setNewPenginapan((prev) => ({
          ...prev,
          gambar: previewUrl,
          gambarFile: file,
        }));
        break;
      case "paketWisata":
        setNewPaketWisata((prev) => ({
          ...prev,
          gambar: previewUrl,
          gambarFile: file,
        }));
        break;
      case "souvenir":
        setNewSouvenir((prev) => ({
          ...prev,
          gambar: previewUrl,
          gambarFile: file,
        }));
        break;
      default:
        break;
    }
  };

  // Komponen ItemList (sama seperti sebelumnya)
  const ItemList = ({ items, type }) => {
    const handleUpdate = (item) => {
      const isAtraksi = type === "atraksi";
      MySwal.fire({
        title: `Edit ${item.nama}`,
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Nama" value="${item.nama}" />
          ${!isAtraksi ? `<input id="swal-input2" class="swal2-input" placeholder="Harga" value="${item.harga || ""}" />` : ""}
          <label class="mt-3 block">Upload Gambar Baru (Opsional)</label>
          <input type="file" accept="image/*" id="swal-gambar" class="swal2-input" />
          <div class="mt-2 flex justify-center">
            <img id="swal-preview" src="${item.gambar || ""}" alt="Preview" style="max-width: 100%; max-height: 150px; display: ${item.gambar ? "block" : "none"}" />
          </div>
        `,
        focusConfirm: false,
        didOpen: () => {
          const fileInput = document.getElementById("swal-gambar");
          const previewImg = document.getElementById("swal-preview");

          fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
              const previewUrl = URL.createObjectURL(file);
              previewImg.src = previewUrl;
              previewImg.style.display = "block";
            }
          });
        },
        preConfirm: () => {
          return new Promise((resolve) => {
            const nama = document.getElementById("swal-input1").value;
            const harga = !isAtraksi
              ? document.getElementById("swal-input2").value
              : "";
            const fileInput = document.getElementById("swal-gambar");
            const file = fileInput.files[0];

            if (!nama.trim()) {
              Swal.showValidationMessage("Nama harus diisi");
              return resolve(false);
            }

            const result = {
              ...item,
              nama,
              ...(!isAtraksi && { harga }),
              gambar: item.gambar,
              gambarFile: file || null,
            };
            resolve(result);
          });
        },
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          handleUpdateItem(result.value, type);
        }
      });
    };

    return (
      <div className="flex flex-wrap gap-4 mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-md p-3 relative"
            style={{ width: "200px" }}
          >
            <div className="h-32 mb-2 bg-gray-100 flex items-center justify-center">
              {item.gambar ? (
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaImage className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h4 className="font-medium text-sm">{item.nama}</h4>
            {!["atraksi"].includes(type) && (
              <p className="text-sm text-gray-500">{item.harga}</p>
            )}
            <div className="absolute top-1 right-1 flex gap-1">
              <FaEdit
                onClick={() => handleUpdate(item)}
                className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 cursor-pointer"
                size={14}
              />
              <FaTrashAlt
                onClick={() => handleHapusItem(item.id, type)}
                className="bg-red-500 text-white rounded-full p-1 w-6 h-6 cursor-pointer"
                size={14}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getEntityKey = (type) => {
    if (type === "paketWisata") return "paket_wisata";
    if (type === "souvenir") return "suvenir";
    return type;
  };

  // Fungsi untuk menyimpan ke database
  const simpanKeDatabase = async (item, type) => {
    try {
      const payload = {
        [getEntityKey(type)]: [item],
      };

      await axiosInstance.patch(
        `/api/deskripsi-wisata/${kdDesa}`,
        { data: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(`Gagal menyimpan ${type}:`, error);
      throw error;
    }
  };

  // Fungsi untuk menghapus dari database
  const hapusDariDatabase = async (id, type) => {
    try {
      const correctedType = getEntityKey(type);

      // Kirim permintaan langsung ke API dengan item.id
      await axiosInstance.patch(
        `/api/deskripsi-wisata/${kdDesa}/remove-item`,
        {
          entity_type: correctedType,
          item_id: id, // kirim ID langsung, bukan index
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(`Gagal menghapus ${type}:`, error);
      throw error;
    }
  };

  // Fungsi untuk update di database
  const updateDiDatabase = async (updatedItem, type) => {
    try {
      // Untuk update, kita hapus yang lama dan tambahkan yang baru
      // Cari index item lama
      let items;
      switch (type) {
        case "atraksi":
          items = atraksi;
          break;
        case "penginapan":
          items = penginapan;
          break;
        case "paketWisata":
          items = paketWisata;
          break;
        case "souvenir":
          items = souvenir;
          break;
        default:
          return;
      }

      const index = items.findIndex((item) => item.id === updatedItem.id);
      if (index === -1) return;

      // Hapus item lama
      await hapusDariDatabase(updatedItem.id, type);

      // Tambahkan item baru
      await simpanKeDatabase(updatedItem, type);
    } catch (error) {
      console.error(`Gagal memperbarui ${type}:`, error);
      throw error;
    }
  };

  // Komponen Image Upload
  const ImageUpload = ({ previewUrl, onChange, onRemove, type }) => (
    <div
      className="border border-dashed border-gray-300 rounded-md p-4 mb-4 flex justify-center items-center"
      style={{ height: "150px", width: "100%" }}
    >
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <FaTimes
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs cursor-pointer"
            size={16}
          />
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
          <FaImage className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Upload Gambar</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e, type)}
          />
        </label>
      )}
    </div>
  );

  // Komponen Tambah Button dengan loading state
  const TambahButton = ({ label, onClick }) => (
    <button
      onClick={onClick}
      disabled={isUploading}
      className={`flex items-center justify-center gap-2 border border-dashed border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors w-full md:w-auto mt-4 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isUploading ? (
        <span>Memproses...</span>
      ) : (
        <>
          <FaPlus size={16} />
          <span>{label}</span>
        </>
      )}
    </button>
  );

  const handleRemoveImage = (type) => {
    switch (type) {
      case "atraksi":
        setNewAtraksi((prev) => ({ ...prev, gambar: null, gambarFile: null }));
        break;
      case "penginapan":
        setNewPenginapan((prev) => ({
          ...prev,
          gambar: null,
          gambarFile: null,
        }));
        break;
      case "paketWisata":
        setNewPaketWisata((prev) => ({
          ...prev,
          gambar: null,
          gambarFile: null,
        }));
        break;
      case "souvenir":
        setNewSouvenir((prev) => ({ ...prev, gambar: null, gambarFile: null }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-gray-50 md:mt-0 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fasilitas & Produk Desa Wisata</h1>
          {namaDesa && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{namaDesa}</span>
            </p>
          )}
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

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Atraksi */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Atraksi Wisata</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload
                previewUrl={newAtraksi.gambar}
                onChange={handleImageUpload}
                onRemove={() => handleRemoveImage("atraksi")}
                type="atraksi"
              />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nama Atraksi"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newAtraksi.nama}
                  onChange={(e) =>
                    setNewAtraksi({ ...newAtraksi, nama: e.target.value })
                  }
                />
              </div>
              <TambahButton
                label="Tambah Atraksi"
                onClick={() => handleTambahItem("atraksi")}
              />
            </div>
          </div>
          <ItemList items={atraksi} type="atraksi" />
        </div>

        {/* Penginapan */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Penginapan</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload
                previewUrl={newPenginapan.gambar}
                onChange={handleImageUpload}
                onRemove={() => handleRemoveImage("penginapan")}
                type="penginapan"
              />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama Penginapan"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newPenginapan.nama}
                  onChange={(e) =>
                    setNewPenginapan({ ...newPenginapan, nama: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Harga Penginapan"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newPenginapan.harga}
                  onChange={(e) =>
                    setNewPenginapan({
                      ...newPenginapan,
                      harga: e.target.value,
                    })
                  }
                />
              </div>
              <TambahButton
                label="Tambah Penginapan"
                onClick={() => handleTambahItem("penginapan")}
              />
            </div>
          </div>
          <ItemList items={penginapan} type="penginapan" />
        </div>

        {/* Paket Wisata */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Paket Wisata</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload
                previewUrl={newPaketWisata.gambar}
                onChange={handleImageUpload}
                onRemove={() => handleRemoveImage("paketWisata")}
                type="paketWisata"
              />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama Paket Wisata"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newPaketWisata.nama}
                  onChange={(e) =>
                    setNewPaketWisata({
                      ...newPaketWisata,
                      nama: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Harga Paket Wisata"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newPaketWisata.harga}
                  onChange={(e) =>
                    setNewPaketWisata({
                      ...newPaketWisata,
                      harga: e.target.value,
                    })
                  }
                />
              </div>
              <TambahButton
                label="Tambah Paket"
                onClick={() => handleTambahItem("paketWisata")}
              />
            </div>
          </div>
          <ItemList items={paketWisata} type="paketWisata" />
        </div>

        {/* Souvenir */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Souvenir</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload
                previewUrl={newSouvenir.gambar}
                onChange={handleImageUpload}
                onRemove={() => handleRemoveImage("souvenir")}
                type="souvenir"
              />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama Souvenir"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newSouvenir.nama}
                  onChange={(e) =>
                    setNewSouvenir({ ...newSouvenir, nama: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Harga Souvenir"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newSouvenir.harga}
                  onChange={(e) =>
                    setNewSouvenir({ ...newSouvenir, harga: e.target.value })
                  }
                />
              </div>
              <TambahButton
                label="Tambah Souvenir"
                onClick={() => handleTambahItem("souvenir")}
              />
            </div>
          </div>
          <ItemList items={souvenir} type="souvenir" />
        </div>
      </div>
    </div>
  );
};

export default FasilitasProduk;
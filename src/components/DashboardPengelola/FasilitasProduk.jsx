import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaPlus, FaTimes, FaImage, FaTrashAlt, FaEdit } from "react-icons/fa";
import profile from "../../assets/Dashboard/profile.svg";

const FasilitasProduk = () => {
  const MySwal = withReactContent(Swal);

  // State untuk data
  const [atraksi, setAtraksi] = useState([]);
  const [penginapan, setPenginapan] = useState([]);
  const [paketWisata, setPaketWisata] = useState([]);
  const [souvenir, setSouvenir] = useState([]);

  // Form input states
  const [newAtraksi, setNewAtraksi] = useState({ nama: "", gambar: null });
  const [newPenginapan, setNewPenginapan] = useState({ nama: "", harga: "", gambar: null });
  const [newPaketWisata, setNewPaketWisata] = useState({ nama: "", harga: "", gambar: null });
  const [newSouvenir, setNewSouvenir] = useState({ nama: "", harga: "", gambar: null });

  // Handler tambah item dengan SweetAlert
  const handleTambahItem = (type) => {
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

    MySwal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menambahkan ${type}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const items = type === "atraksi" ? atraksi : type === "penginapan" ? penginapan : type === "paketWisata" ? paketWisata : souvenir;
        const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

        const itemToSave = { id: newId, ...newItem };
        setter([...items, itemToSave]);
        resetForm(type);
        simpanKeDatabase(itemToSave, type);
        MySwal.fire("Berhasil!", `${type} ditambahkan.`, "success");
      }
    });
  };

  const resetForm = (type) => {
    switch (type) {
      case "atraksi":
        setNewAtraksi({ nama: "", gambar: null });
        break;
      case "penginapan":
        setNewPenginapan({ nama: "", harga: "", gambar: null });
        break;
      case "paketWisata":
        setNewPaketWisata({ nama: "", harga: "", gambar: null });
        break;
      case "souvenir":
        setNewSouvenir({ nama: "", harga: "", gambar: null });
        break;
    }
  };

  // Handler hapus item
  const handleHapusItem = (id, type) => {
    MySwal.fire({
      title: "Konfirmasi Hapus",
      text: "Anda yakin ingin menghapus item ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        switch (type) {
          case "atraksi":
            setAtraksi(atraksi.filter((item) => item.id !== id));
            break;
          case "penginapan":
            setPenginapan(penginapan.filter((item) => item.id !== id));
            break;
          case "paketWisata":
            setPaketWisata(paketWisata.filter((item) => item.id !== id));
            break;
          case "souvenir":
            setSouvenir(souvenir.filter((item) => item.id !== id));
            break;
          default:
            break;
        }
        hapusDariDatabase(id, type);
        MySwal.fire("Dihapus!", "Item berhasil dihapus.", "success");
      }
    });
  };

  // Handler update item
  const handleUpdateItem = (updatedItem, type) => {
    switch (type) {
      case "atraksi":
        setAtraksi(atraksi.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
        break;
      case "penginapan":
        setPenginapan(penginapan.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
        break;
      case "paketWisata":
        setPaketWisata(paketWisata.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
        break;
      case "souvenir":
        setSouvenir(souvenir.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
        break;
      default:
        break;
    }
    updateDiDatabase(updatedItem, type);
  };

  // Upload gambar
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        switch (type) {
          case "atraksi":
            setNewAtraksi((prev) => ({ ...prev, gambar: imageUrl }));
            break;
          case "penginapan":
            setNewPenginapan((prev) => ({ ...prev, gambar: imageUrl }));
            break;
          case "paketWisata":
            setNewPaketWisata((prev) => ({ ...prev, gambar: imageUrl }));
            break;
          case "souvenir":
            setNewSouvenir((prev) => ({ ...prev, gambar: imageUrl }));
            break;
          default:
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Komponen ItemList
  const ItemList = ({ items, type }) => {
    const handleUpdate = (item) => {
      const isAtraksi = type === "atraksi";
      MySwal.fire({
        title: `Edit ${item.nama}`,
        html: `
      <input id="swal-input1" class="swal2-input" placeholder="Nama" value="${item.nama}" />
      ${!isAtraksi ? `<input id="swal-input2" class="swal2-input" placeholder="Harga" value="${item.harga}" />` : ""}
      <label class="mt-3 block">Upload Gambar Baru (Opsional)</label>
      <input type="file" accept="image/*" id="swal-gambar" class="swal2-input" />
      <div class="mt-2 flex justify-center">
        <img id="swal-preview" src="${item.gambar || ""}" alt="Preview" style="max-width: 100%; max-height: 150px; display: ${item.gambar ? "block" : "none"}" />
      </div>
    `,
        focusConfirm: false,
        didOpen: () => {
          // Event listener untuk preview gambar
          const fileInput = document.getElementById("swal-gambar");
          const previewImg = document.getElementById("swal-preview");

          fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file && file.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.onload = function (e) {
                previewImg.src = e.target.result;
                previewImg.style.display = "block";
              };
              reader.readAsDataURL(file);
            }
          });
        },
        preConfirm: () => {
          const nama = document.getElementById("swal-input1").value;
          const harga = !isAtraksi ? document.getElementById("swal-input2").value : "";
          const fileInput = document.getElementById("swal-gambar");
          const file = fileInput.files[0];

          return new Promise((resolve, reject) => {
            if (!nama.trim()) {
              Swal.showValidationMessage("Nama harus diisi");
              return reject();
            }

            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({ nama, ...(harga && { harga }), gambar: reader.result });
              };
              reader.onerror = () => reject("Error membaca file");
              reader.readAsDataURL(file);
            } else {
              resolve({ nama, ...(harga && { harga }), gambar: item.gambar });
            }
          });
        },
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedData = {
            ...item,
            nama: result.value.nama,
            ...(harga && { harga: result.value.harga }),
            gambar: result.value.gambar,
          };
          handleUpdateItem(updatedData, type);
        }
      });
    };

    return (
      <div className="flex flex-wrap gap-4 mt-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-md p-3 relative" style={{ width: "200px" }}>
            <div className="h-32 mb-2 bg-gray-100 flex items-center justify-center">{item.gambar ? <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" /> : <FaImage className="w-8 h-8 text-gray-400" />}</div>
            <h4 className="font-medium text-sm">{item.nama}</h4>
            {!["atraksi"].includes(type) && <p className="text-sm text-gray-500">{item.harga}</p>}
            <div className="absolute top-1 right-1 flex gap-1">
              <FaEdit onClick={() => handleUpdate(item)} className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 cursor-pointer" size={14} />
              <FaTrashAlt onClick={() => handleHapusItem(item.id, type)} className="bg-red-500 text-white rounded-full p-1 w-6 h-6 cursor-pointer" size={14} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Dummy functions for database interaction
  const simpanKeDatabase = (item, type) => {
    console.log(`Menyimpan ${type}:`, item);
    // Di sini Anda bisa panggil API POST / PUT
  };

  const hapusDariDatabase = (id, type) => {
    console.log(`Menghapus ${type} ID: ${id}`);
    // Panggil API DELETE
  };

  const updateDiDatabase = (item, type) => {
    console.log(`Memperbarui ${type}:`, item);
    // Panggil API PUT
  };

  // Komponen Image Upload
  const ImageUpload = ({ previewUrl, onChange, type }) => (
    <div className="border border-dashed border-gray-300 rounded-md p-4 mb-4 flex justify-center items-center" style={{ height: "150px", width: "100%" }}>
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <FaTimes onClick={() => onChange({ target: { files: [] } }, type)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs" size={16} />
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
          <FaImage className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Upload Gambar</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e, type)} />
        </label>
      )}
    </div>
  );

  // Komponen Tambah Button
  const TambahButton = ({ label, onClick }) => (
    <button onClick={onClick} className="flex items-center justify-center gap-2 border border-dashed border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors w-full md:w-auto mt-4">
      <FaPlus size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-gray-50 md:mt-0 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fasilitas & Produk Desa Wisata</h1>
        <div className="flex items-center">
          <div className="mr-2 text-right">
            <div className="font-semibold">Alfian Maulana</div>
            <div className="text-sm text-gray-500">Pengelola</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
            <img src={profile} alt="Profile" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Atraksi */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Atraksi Wisata</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload previewUrl={newAtraksi.gambar} onChange={handleImageUpload} type="atraksi" />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4">
                <input type="text" placeholder="Nama Atraksi" className="w-full p-2 border border-gray-300 rounded-md" value={newAtraksi.nama} onChange={(e) => setNewAtraksi({ ...newAtraksi, nama: e.target.value })} />
              </div>
              <TambahButton label="Tambah Atraksi" onClick={() => handleTambahItem("atraksi")} />
            </div>
          </div>
          <ItemList items={atraksi} type="atraksi" />
        </div>

        {/* Penginapan */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Penginapan</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload previewUrl={newPenginapan.gambar} onChange={handleImageUpload} type="penginapan" />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nama Penginapan" className="w-full p-2 border border-gray-300 rounded-md" value={newPenginapan.nama} onChange={(e) => setNewPenginapan({ ...newPenginapan, nama: e.target.value })} />
                <input type="text" placeholder="Harga Penginapan" className="w-full p-2 border border-gray-300 rounded-md" value={newPenginapan.harga} onChange={(e) => setNewPenginapan({ ...newPenginapan, harga: e.target.value })} />
              </div>
              <TambahButton label="Tambah Penginapan" onClick={() => handleTambahItem("penginapan")} />
            </div>
          </div>
          <ItemList items={penginapan} type="penginapan" />
        </div>

        {/* Paket Wisata */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Paket Wisata</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload previewUrl={newPaketWisata.gambar} onChange={handleImageUpload} type="paketWisata" />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nama Paket Wisata" className="w-full p-2 border border-gray-300 rounded-md" value={newPaketWisata.nama} onChange={(e) => setNewPaketWisata({ ...newPaketWisata, nama: e.target.value })} />
                <input type="text" placeholder="Harga Paket Wisata" className="w-full p-2 border border-gray-300 rounded-md" value={newPaketWisata.harga} onChange={(e) => setNewPaketWisata({ ...newPaketWisata, harga: e.target.value })} />
              </div>
              <TambahButton label="Tambah Paket" onClick={() => handleTambahItem("paketWisata")} />
            </div>
          </div>
          <ItemList items={paketWisata} type="paketWisata" />
        </div>

        {/* Souvenir */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Souvenir</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <ImageUpload previewUrl={newSouvenir.gambar} onChange={handleImageUpload} type="souvenir" />
            </div>
            <div className="w-full md:w-4/5">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nama Souvenir" className="w-full p-2 border border-gray-300 rounded-md" value={newSouvenir.nama} onChange={(e) => setNewSouvenir({ ...newSouvenir, nama: e.target.value })} />
                <input type="text" placeholder="Harga Souvenir" className="w-full p-2 border border-gray-300 rounded-md" value={newSouvenir.harga} onChange={(e) => setNewSouvenir({ ...newSouvenir, harga: e.target.value })} />
              </div>
              <TambahButton label="Tambah Souvenir" onClick={() => handleTambahItem("souvenir")} />
            </div>
          </div>
          <ItemList items={souvenir} type="souvenir" />
        </div>
      </div>
    </div>
  );
};

export default FasilitasProduk;

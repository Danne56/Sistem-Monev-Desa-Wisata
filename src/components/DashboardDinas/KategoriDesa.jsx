import React, { useState, useEffect } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown, FaPencilAlt, FaTimes } from "react-icons/fa";

export const KategoriDesa = () => {
  const [villages, setVillages] = useState([
    { id: 1, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 100 },
    { id: 2, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 100 },
    { id: 3, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 100 },
    { id: 4, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 100 },
    { id: 5, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 99 },
    { id: 6, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 99 },
    { id: 7, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 99 },
    { id: 8, name: "Desa Wisata Lorem Ipsum", category: "Mandiri", score: 98 },
  ]);

  const [categoryFilter, setCategoryFilter] = useState("Perintis");
  const [provinceFilter, setProvinceFilter] = useState("Jawa Tengah");
  const [regionFilter, setRegionFilter] = useState("Magelang");
  const [sortFilter, setSortFilter] = useState("Rerata Tertinggi");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentVillage, setCurrentVillage] = useState(null);
  
  // Score form state
  const [scores, setScores] = useState({
    partisipasi: 100,
    keragaman: 100,
    akses: 99,
    keramahan: 99,
    fasilitas: 99,
    produk: ""
  });

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

  const changeCategory = (villageId, newCategory) => {
    setVillages(villages.map((village) => (village.id === villageId ? { ...village, category: newCategory } : village)));
    setOpenDropdown(null);
  };

  const openEditScorePopup = (village) => {
    setCurrentVillage(village);
    setScores({
      partisipasi: 100,
      keragaman: 100,
      akses: 99,
      keramahan: 99,
      fasilitas: 99,
      produk: ""
    });
    setShowPopup(true);
  };

  const handleSaveScores = () => {
    // Calculate new average score
    const scoreValues = Object.values(scores).filter(score => score !== "");
    const numericScores = scoreValues.map(score => typeof score === 'string' ? parseInt(score, 10) : score);
    const average = Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length);
    
    // Update village score
    setVillages(villages.map((village) => 
      village.id === currentVillage.id ? { ...village, score: average } : village
    ));
    
    setShowPopup(false);
  };

  const categoryOptions = ["Mandiri", "Berkembang", "Perintis", "Rintisan"];

  return (
    <div className="flex-1 overflow-x-auto md:mt-0 mt-16">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kategori Desa Wisata</h1>
          <div className="flex items-center">
            <div className="mr-2 text-right">
              <div className="font-semibold">Alfian Maulana</div>
              <div className="text-sm text-gray-500">Dinas</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
              <img src="/api/placeholder/40/40" alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Kategori</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="Perintis">Perintis</option>
                <option value="Berkembang">Berkembang</option>
                <option value="Mandiri">Mandiri</option>
                <option value="Rintisan">Rintisan</option>
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
                <option value="Magelang">Magelang</option>
                <option value="Semarang">Semarang</option>
                <option value="Solo">Solo</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Urutkan</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white" value={sortFilter} onChange={(e) => setSortFilter(e.target.value)}>
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

        {/* Table */}
        <div className="bg-gray-50 rounded-lg overflow-x-scroll shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-600">No</div>
            <div className="text-sm font-medium text-gray-600">Nama Desa Wisata</div>
            <div className="text-sm font-medium text-gray-600">Kategori</div>
            <div className="text-sm font-medium text-gray-600">Edit Skor</div>
            <div className="text-sm font-medium text-gray-600">Rerata Skor</div>
          </div>

          {/* Table Body */}
          {villages.map((village) => (
            <div key={village.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-50">
              <div className="text-sm text-gray-900">{village.id}</div>
              <div className="text-sm text-gray-900">{village.name}</div>
              <div className="text-sm">
                <div className="category-dropdown relative">
                  <button onClick={() => toggleDropdown(village.id)} className="inline-flex items-center px-3 py-1 rounded bg-blue-500 text-white">
                    {village.category}
                  </button>

                  {openDropdown === village.id && (
                    <div className="absolute mt-1 w-44 bg-white rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        {categoryOptions.map((category) => (
                          <li key={category}>
                            <button onClick={() => changeCategory(village.id, category)} className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${village.category === category ? "font-bold" : ""}`}>
                              {category}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-900">
                <button onClick={() => openEditScorePopup(village)} className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <FaPencilAlt size={12} className="mr-2" /> Edit Skor 
                </button>
              </div>
              <div className="text-sm text-gray-900">{village.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Score Popup */}
      {showPopup && currentVillage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            {/* Popup Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{currentVillage.name}</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            {/* Popup Content */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Partisipasi Masyarakat</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={scores.partisipasi} 
                    onChange={(e) => setScores({...scores, partisipasi: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Keragaman Paket Wisata</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={scores.keragaman} 
                    onChange={(e) => setScores({...scores, keragaman: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Akses Tempat Wisata</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={scores.akses} 
                    onChange={(e) => setScores({...scores, akses: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Keramahan Difabel</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={scores.keramahan} 
                    onChange={(e) => setScores({...scores, keramahan: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Fasilitas Tempat Wisata</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={scores.fasilitas} 
                    onChange={(e) => setScores({...scores, fasilitas: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Produk Tempat Wisata</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan angka 1-100" 
                    value={scores.produk} 
                    onChange={(e) => setScores({...scores, produk: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm mb-1">Rerata Skor</label>
                <input 
                  type="number" 
                  value={scores.partisipasi} 
                  disabled 
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
            </div>
            
            {/* Popup Footer */}
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                onClick={() => setShowPopup(false)} 
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveScores} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown } from "react-icons/fa";

export const StatusDesa = () => {
  const [villages, setVillages] = useState([
    { id: 1, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 2, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 3, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 4, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 5, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 6, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 7, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
    { id: 8, name: "Desa Wisata Lorem Ipsum", status: "Aktif", description: "Masih aktif lorem ipsum dolor sit amet" },
  ]);

  const [statusFilter, setStatusFilter] = useState("Aktif");
  const [provinceFilter, setProvinceFilter] = useState("Jawa Tengah");
  const [regionFilter, setRegionFilter] = useState("Magelang");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".status-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const changeStatus = (villageId, newStatus) => {
    setVillages(villages.map((village) => (village.id === villageId ? { ...village, status: newStatus } : village)));
    setOpenDropdown(null);
  };

  return (
    <div className="flex-1 overflow-x-auto md:ml-0 md:mt-0 mt-16">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Status Desa</h1>
          <div className="flex items-center">
            <div className="mr-2 text-right">
              <div className="font-semibold">Alfian Maulana</div>
              <div className="text-sm text-gray-500">Dinas</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
              <img src={profile} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">Status</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-4 py-2 appearance-none bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Semua">Semua</option>
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
        </div>

        {/* Table */}
        <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-600">No</div>
            <div className="text-sm font-medium text-gray-600">Nama Desa Wisata</div>
            <div className="text-sm font-medium text-gray-600">Status</div>
            <div className="text-sm font-medium text-gray-600">Keterangan</div>
          </div>

          {/* Table Body */}
          {villages.map((village) => (
            <div key={village.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-50">
              <div className="text-sm text-gray-900">{village.id}</div>
              <div className="text-sm text-gray-900">{village.name}</div>
              <div className="text-sm">
                <div className="status-dropdown relative">
                  <button onClick={() => toggleDropdown(village.id)} className="inline-flex items-center px-3 py-1 rounded bg-blue-500 text-white">
                    {village.status} <FaCaretDown size={16} className="ml-1" />
                  </button>

                  {openDropdown === village.id && (
                    <div className="absolute mt-1 w-44 bg-white rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button onClick={() => changeStatus(village.id, "Aktif")} className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${village.status === "Aktif" ? "font-bold" : ""}`}>
                            Aktif
                          </button>
                        </li>
                        <li>
                          <button onClick={() => changeStatus(village.id, "Tidak Aktif")} className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${village.status === "Tidak Aktif" ? "font-bold" : ""}`}>
                            Tidak Aktif
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">{village.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

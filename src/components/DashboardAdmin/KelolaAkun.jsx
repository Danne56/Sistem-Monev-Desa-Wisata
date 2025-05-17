import React, { useState } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import { FaCaretDown, FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export const KelolaAkun = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 2, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 3, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 4, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 5, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 6, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 7, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
    { id: 8, name: "Desa Wisata Lorem Ipsum", email: "desawisata@gmail.com", status: "Aktif" },
  ]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    status: "Aktif",
    provinsi: "Jawa Tengah",
    kabupaten: "Magelang"
  });

  // Filter options
  const statusOptions = ["Aktif", "Tidak Aktif"];
  const provinsiOptions = ["Jawa Tengah", "Jawa Barat", "Jawa Timur", "DIY"];
  const kabupatenOptions = ["Magelang", "Semarang", "Wonosobo", "Temanggung"];

  // Close dropdown when clicking outside
  React.useEffect(() => {
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

  const changeStatus = (accountId, newStatus) => {
    Swal.fire({
      title: "Konfirmasi Perubahan Status",
      text: `Apakah Anda yakin ingin mengubah status akun menjadi "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setAccounts(accounts.map((acc) => (acc.id === accountId ? { ...acc, status: newStatus } : acc)));
        setOpenDropdown(null);

        Swal.fire("Berhasil!", "Status akun berhasil diubah.", "success");
      }
    });
  };

  const handleResetPassword = (accountId) => {
    Swal.fire({
      title: "Reset Password",
      text: "Apakah Anda yakin ingin mereset password akun ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Reset!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Berhasil!", "Password akun berhasil direset.", "success");
      }
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="flex-1 overflow-x-auto md:ml-0 md:mt-0 mt-16">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Akun</h1>
          <div className="flex items-center">
            <div className="mr-2 text-right">
              <div className="font-semibold">Alfian Maulana</div>
              <div className="text-sm text-gray-500">Admin</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden">
              <img src={profile} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <div className="text-sm mb-2">Status</div>
            <div className="relative inline-block w-full">
              <select 
                className="border border-gray-300 rounded px-4 py-2 pr-10 appearance-none bg-white w-full"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>
          
          {/* Provinsi Filter */}
          <div>
            <div className="text-sm mb-2">Provinsi</div>
            <div className="relative inline-block w-full">
              <select 
                className="border border-gray-300 rounded px-4 py-2 pr-10 appearance-none bg-white w-full"
                value={filters.provinsi}
                onChange={(e) => handleFilterChange("provinsi", e.target.value)}
              >
                {provinsiOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>
          
          {/* Kabupaten/Kota Filter */}
          <div>
            <div className="text-sm mb-2">Kabupaten/Kota</div>
            <div className="relative inline-block w-full">
              <select 
                className="border border-gray-300 rounded px-4 py-2 pr-10 appearance-none bg-white w-full"
                value={filters.kabupaten}
                onChange={(e) => handleFilterChange("kabupaten", e.target.value)}
              >
                {kabupatenOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaCaretDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-x-scroll shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Desa Wisata
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Password
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status Akun
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{account.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{account.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{account.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button 
                      onClick={() => handleResetPassword(account.id)} 
                      className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Ubah Password <FaPencilAlt size={12} className="ml-1" />
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm relative">
                    <div className="status-dropdown">
                      <button 
                        onClick={() => toggleDropdown(account.id)} 
                        className={`inline-flex items-center px-3 py-1 rounded ${account.status === 'Aktif' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      >
                        {account.status} <FaCaretDown size={16} className="ml-1" />
                      </button>

                      {openDropdown === account.id && (
                        <div className="absolute mt-1 w-44 bg-white rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            {statusOptions.map((status) => (
                              <li key={status}>
                                <button 
                                  onClick={() => changeStatus(account.id, status)} 
                                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${status === account.status ? "font-bold" : ""}`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
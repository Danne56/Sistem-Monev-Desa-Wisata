import React, { useState } from "react";
import profile from "../../assets/Dashboard/profile.svg";
import Swal from "sweetalert2";

export const Akun = () => {
  const [email, setEmail] = useState("desawisata@gmail.com");
  const [password, setPassword] = useState("********");
  const [isEditing, setIsEditing] = useState({
    email: false,
    password: false,
  });
  const [tempValues, setTempValues] = useState({
    email: "",
    password: "",
  });

  const handleEdit = (field) => {
    setTempValues({
      ...tempValues,
      [field]: field === "email" ? email : "",
    });
    setIsEditing({
      ...isEditing,
      [field]: true,
    });
  };

  const handleSave = () => {
    Swal.fire({
      title: "Konfirmasi Perubahan",
      text: "Apakah Anda yakin ingin menyimpan perubahan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        if (isEditing.email && tempValues.email) {
          setEmail(tempValues.email);
        }
        if (isEditing.password && tempValues.password) {
          setPassword("********"); // Always display asterisks for password
        }
        setIsEditing({ email: false, password: false });

        Swal.fire("Berhasil!", "Detail akun berhasil diperbarui.", "success");
      }
    });
  };

  const handleCancel = () => {
    setIsEditing({ email: false, password: false });
  };

  return (
    <div className="flex-1 overflow-x-auto md:ml-0 md:mt-0 mt-16">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detail akun</h1>
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

        {/* Account Details Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            {/* Email Field */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
              <label className="text-gray-700 font-medium">Email</label>
              <div className="sm:col-span-2 flex items-center">
                {isEditing.email ? (
                  <input type="email" value={tempValues.email} onChange={(e) => setTempValues({ ...tempValues, email: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full" />
                ) : (
                  <div className="border border-gray-300 rounded px-3 py-2 bg-white">{email}</div>
                )}
                {isEditing.email ? null : (
                  <button onClick={() => handleEdit("email")} className="ml-2 text-blue-500 text-sm hover:underline">
                    ubah email
                  </button>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
              <label className="text-gray-700 font-medium">Password</label>
              <div className="sm:col-span-2 flex items-center">
                {isEditing.password ? (
                  <input
                    type="password"
                    value={tempValues.password}
                    onChange={(e) => setTempValues({ ...tempValues, password: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Masukkan password baru"
                  />
                ) : (
                  <div className="border border-gray-300 rounded px-3 py-2 bg-white w-32">{password}</div>
                )}
                {isEditing.password ? null : (
                  <button onClick={() => handleEdit("password")} className="ml-2 text-blue-500 text-sm hover:underline">
                    ubah password
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons - only show when editing */}
            {(isEditing.email || isEditing.password) && (
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={handleCancel} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                  Batal
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Simpan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

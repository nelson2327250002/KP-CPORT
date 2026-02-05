// Isi BARU untuk: src/components/kontrol/FormPengguna.tsx (cport-boss-web)

"use client"; 

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 1. ⬇️ TAMBAHKAN 'Boss' DI SINI ⬇️
type FormPenggunaProps = {
  pengguna?: {
    id: string;
    nama: string;
    email: string;
    role: "Admin" | "Sales" | "Boss"; // Tambahkan "Boss"
  };
};

// 2. ⬇️ TAMBAHKAN 'Boss' DI SINI ⬇️
const roles: ("Admin" | "Sales" | "Boss")[] = ["Admin", "Sales", "Boss"];

export default function FormPengguna({ pengguna }: FormPenggunaProps) {
  const router = useRouter();
  const isEditMode = !!pengguna; 

  const [nama, setNama] = useState(pengguna?.nama || "");
  const [email, setEmail] = useState(pengguna?.email || "");
  // 3. ⬇️ TAMBAHKAN 'Boss' DI SINI ⬇️
  const [role, setRole] = useState<"Admin" | "Sales" | "Boss" | "">(pengguna?.role || "");
  const [password, setPassword] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      alert("Harap pilih role pengguna.");
      return;
    }
    if (!isEditMode && !password) {
      alert("Password wajib diisi untuk pengguna baru.");
      return;
    }

    const data = { nama, email, role, password };

    try {
      let url = 'http://localhost:3000/users';
      let method = 'POST';

      if (isEditMode) {
        url = `http://localhost:3000/users/${pengguna!.id}`;
        method = 'PATCH';
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }

      alert(`Pengguna "${nama}" berhasil ${isEditMode ? 'diupdate' : 'dibuat'}!`);
      router.push("/kontrol/pengguna");

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(`Terjadi kesalahan: ${error.message}`);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Input Nama */}
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        {/* Input Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email (untuk Login)
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Pilihan Role (Dropdown) */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Role / Hak Akses
          </label>
          <select
            id="role"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value as "Admin" | "Sales" | "Boss")}
            required
          >
            <option value="" disabled>-- Pilih role --</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Input Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditMode} // Wajib hanya di mode "Tambah Baru"
            placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah" : "Wajib diisi"}
          />
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
          >
            {isEditMode ? "Simpan Perubahan" : "Simpan Pengguna Baru"}
          </button>
        </div>
      </form>
    </div>
  );
}
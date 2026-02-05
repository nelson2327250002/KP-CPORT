// Isi BARU untuk: src/components/kontrol/TabelPengguna.tsx

"use client"; 
import React, { useState, useEffect } from "react"; // 1. Import hook
import Link from "next/link"; 

// Tipe data User (HARUS SAMA DENGAN DI API)
type User = {
  id: string;
  nama: string;
  email: string;
  role: 'Admin' | 'Sales' | 'Boss';
};

// ... (Fungsi getRoleClass tetap sama) ...
const getRoleClass = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Sales":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};


export default function TabelPengguna() {
  // 2. State untuk menyimpan data live dan status loading
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fungsi untuk mengambil data dari "mesin"
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/users'); // PANGGIL API ANDA
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      alert("Gagal mengambil data pengguna.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleHapus = async (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${nama}?`)) {
      try {
        // 1. Panggil API "mesin" dengan method DELETE
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus pengguna');
        }
        
        alert(`Pengguna ${nama} berhasil dihapus.`);
        
        // 2. Refresh data di tabel secara otomatis
        fetchUsers(); // Panggil fungsi ini untuk muat ulang tabel

      } catch (error) {
        console.error(error);
        alert("Gagal menghapus pengguna.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Semua Akun Pengguna</h3>
        <Link href="/kontrol/pengguna/baru">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium">
            + Tambah Pengguna Baru
          </span>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            {/* ... (Header tabel tetap sama) ... */}
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Nama</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* 5. Tampilkan status Loading atau Data */}
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Mengambil data dari server...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Belum ada data pengguna.
                </td>
              </tr>
            ) : (
              // 6. Map data 'users' dari state (bukan dummy lagi)
              users.map((user) => (
                <tr key={user.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{user.nama}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 flex gap-3">
                    <Link href={`/kontrol/pengguna/edit/${user.id}`}>
                      <span className="text-yellow-500 hover:text-yellow-700 cursor-pointer">
                        Edit
                      </span>
                    </Link>
                    <button
                      onClick={() => handleHapus(user.id, user.nama)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
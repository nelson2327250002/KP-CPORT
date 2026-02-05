// Isi BARU untuk: src/components/datamaster/TabelToko.tsx

"use client"; 
import React, { useState, useEffect } from "react"; // 1. Import hook
import Link from "next/link";

// 2. Tipe data (HARUS SAMA DENGAN API)
type Store = {
  id: number;
  nama: string;
  alamat: string;
  namaBoss: string;
  kontakBoss: string;
};

export default function TabelToko() {
  // 3. State untuk data live
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fungsi fetch data
  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/stores'); // PANGGIL API
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Gagal mengambil data toko:", error);
      alert("Gagal mengambil data toko.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Ambil data saat dimuat
  useEffect(() => {
    fetchStores();
  }, []);

  // 6. Fungsi Hapus yang terhubung ke API
  const handleHapus = async (id: number, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus toko ${nama}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/stores/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Gagal menghapus toko');
        alert(`Toko ${nama} berhasil dihapus.`);
        fetchStores(); // Refresh tabel
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus toko.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daftar Semua Toko</h3>
        <Link href="/data-master/toko/baru">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium">
            + Tambah Toko Baru
          </span>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">ID Toko</th>
              <th className="py-2">Nama Toko</th>
              <th className="py-2">Alamat</th>
              <th className="py-2">Nama Boss</th>
              <th className="py-2">Kontak Boss</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* 7. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Belum ada data toko.</td></tr>
            ) : (
              // 8. Map data 'stores' dari state
              stores.map((toko) => (
                <tr key={toko.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{toko.id}</td>
                  <td className="py-3">{toko.nama}</td>
                  <td className="py-3">{toko.alamat}</td>
                  <td className="py-3">{toko.namaBoss}</td>
                  <td className="py-3">{toko.kontakBoss}</td>
                  <td className="py-3 flex gap-3">
                    <Link href={`/data-master/toko/edit/${toko.id}`}>
                      <span className="text-yellow-500 hover:text-yellow-700 cursor-pointer">
                        Edit
                      </span>
                    </Link>
                    <button
                      onClick={() => handleHapus(toko.id, toko.nama)}
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
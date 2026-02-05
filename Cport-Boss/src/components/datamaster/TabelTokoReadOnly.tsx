// Isi BARU untuk: src/components/datamaster/TabelTokoReadOnly.tsx

"use client"; // 1. Wajib ditambahkan
import React, { useState, useEffect } from "react"; // 2. Import hook

// 3. Tipe data (HARUS SAMA DENGAN API)
type Store = {
  id: number;
  nama: string;
  alamat: string;
  namaBoss: string;
  kontakBoss: string;
};

// 4. Fungsi formatter ID
const formatStoreId = (id: number) => {
  return `T-${id.toString().padStart(3, '0')}`; // 1 -> T-001
};

export default function TabelTokoReadOnly() {
  // 5. State untuk data live
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 6. Fungsi fetch data
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

  // 7. Ambil data saat dimuat
  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daftar Toko (Pelanggan) Terdaftar</h3>
        <button 
          onClick={fetchStores} 
          disabled={isLoading}
          className="text-blue-600 text-sm disabled:opacity-50"
        >
          {isLoading ? "Memuat..." : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">ID Toko</th>
              <th className="py-2">Nama Toko</th>
              <th className="py-2">Alamat</th>
              <th className="py-2">Kontak Boss</th>
              <th className="py-2">Nama Boss Toko</th>
            </tr>
          </thead>
          <tbody>
            {/* 8. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={5} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-gray-500">Belum ada data toko.</td></tr>
            ) : (
              // 9. Map data 'stores' dari state
              stores.map((toko) => (
                <tr key={toko.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{formatStoreId(toko.id)}</td>
                  <td className="py-3">{toko.nama}</td>
                  <td className="py-3">{toko.alamat}</td>
                  <td className="py-3">{toko.kontakBoss}</td>
                  <td className="py-3">{toko.namaBoss}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
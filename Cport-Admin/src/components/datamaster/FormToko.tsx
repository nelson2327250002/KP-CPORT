// Isi BARU untuk: src/components/datamaster/FormToko.tsx

"use client"; 

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Tipe data (HARUS SAMA DENGAN API)
type Store = {
  id: number;
  nama: string;
  alamat: string;
  namaBoss: string;
  kontakBoss: string;
};

type FormTokoProps = {
  toko?: Store; // 'toko' opsional
};

export default function FormToko({ toko }: FormTokoProps) {
  const router = useRouter();
  const isEditMode = !!toko; // Cek apakah ini mode Edit

  const [nama, setNama] = useState(toko?.nama || "");
  const [alamat, setAlamat] = useState(toko?.alamat || "");
  const [namaBoss, setNamaBoss] = useState(toko?.namaBoss || "");
  const [kontakBoss, setKontakBoss] = useState(toko?.kontakBoss || "");

  // 1. ⬇️ FUNGSI INI KITA HUBUNGKAN KE API ⬇️
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = { nama, alamat, namaBoss, kontakBoss };

    const url = isEditMode 
      ? `http://localhost:3000/stores/${toko!.id}` 
      : 'http://localhost:3000/stores';
      
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal ${isEditMode ? 'mengupdate' : 'menyimpan'} toko`);
      }

      alert(`Toko "${nama}" berhasil ${isEditMode ? 'diupdate' : 'disimpan'}!`);
      router.push("/data-master/toko"); // Arahkan kembali ke daftar

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(`Terjadi kesalahan: ${error.message}`);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    }
  };
  // ⬆️ BATAS AKHIR PERUBAHAN ⬆️

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Input Nama Toko */}
        <div>
          <label htmlFor="namaToko" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Toko
          </label>
          <input
            type="text"
            id="namaToko"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        {/* Input Alamat */}
        <div>
          <label htmlFor="alamatToko" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Alamat
          </label>
          <textarea
            id="alamatToko"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />
        </div>

        {/* Input Nama Boss */}
        <div>
          <label htmlFor="namaBoss" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Boss 
          </label>
          <input
            type="text"
            id="namaBoss"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={namaBoss}
            onChange={(e) => setNamaBoss(e.target.value)}
            required
          />
        </div>
        
        {/* Input Kontak Boss */}
        <div>
          <label htmlFor="kontakBoss" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kontak Boss
          </label>
          <input
            type="text"
            id="kontakBoss"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={kontakBoss}
            onChange={(e) => setKontakBoss(e.target.value)}
            required
            placeholder="Contoh: 0812..."
          />
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
          >
            {isEditMode ? "Simpan Perubahan" : "Simpan Toko Baru"}
          </button>
        </div>
      </form>
    </div>
  );
}
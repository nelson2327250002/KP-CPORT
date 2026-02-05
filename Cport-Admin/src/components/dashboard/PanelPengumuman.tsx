// Isi BARU untuk: src/components/dashboard/PanelPengumuman.tsx

"use client"; 

import React, { useState } from "react";

// 1. Tipe prop baru, agar kita bisa me-refresh tabel induk
type PanelPengumumanProps = {
  onSuccess?: () => void; // Fungsi opsional yang dipanggil setelah sukses
  pembuat?: string; // Siapa yang membuat (misal: "Admin" atau "Boss")
};

export default function PanelPengumuman({ 
  onSuccess, 
  pembuat = "Admin" // Default-nya "Admin"
}: PanelPengumumanProps) {
  const [pesan, setPesan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. ⬇️ FUNGSI INI KITA HUBUNGKAN KE API ⬇️
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !pesan) return;

    setIsLoading(true);
    
    const data = {
      pesan: pesan,
      pembuat: pembuat,
    };

    try {
      const response = await fetch('http://localhost:3000/announcements', { // Panggil API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Gagal mempublikasikan pengumuman');

      alert("Pengumuman berhasil dipublikasikan!");
      setPesan(""); // Kosongkan field
      
      // 3. Panggil fungsi 'onSuccess' jika ada (untuk refresh tabel)
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error(error);
      alert("Gagal mempublikasikan pengumuman.");
    } finally {
      setIsLoading(false);
    }
  };
  // ⬆️ BATAS AKHIR PERUBAHAN ⬆️

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="pengumuman"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Ketik pengumuman Anda untuk tim Sales:
          </label>
          <textarea
            id="pengumuman"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Contoh: Stok produk A menipis, segera hubungi supplier."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Publikasikan Sekarang"}
        </button>
      </form>
    </div>
  );
}
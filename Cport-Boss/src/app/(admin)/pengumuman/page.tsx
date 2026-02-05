// Isi BARU untuk: src/app/(admin)/pengumuman/page.tsx

"use client"; // 1. WAJIB JADI CLIENT COMPONENT

import type { Metadata } from "next";
import React, { useState, useEffect } from "react"; // 2. Import hook

// 3. Impor komponen
import PanelPengumuman from "@/components/dashboard/PanelPengumuman";
import RiwayatPengumuman from "@/components/dashboard/RiwayatPengumuman";

// 4. Tipe data
type Announcement = {
  id: number;
  tanggal: string;
  pembuat: string;
  pesan: string;
};

// (Kita tidak bisa ekspor metadata di Client Component, jadi kita komentari)
/*
export const metadata: Metadata = {
  title: "Manajemen Pengumuman | Cport",
  description: "Buat, edit, dan hapus pengumuman untuk tim Sales",
};
*/

export default function PengumumanPage() {
  // 5. State untuk data live
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 6. Fungsi fetch data
  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Ambil data saat dimuat
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 8. Fungsi Hapus (diteruskan ke tabel)
  const handleHapus = async (id: number, pesan: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengumuman: "${pesan}"?`)) {
      try {
        const response = await fetch(`http://localhost:3000/announcements/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Gagal menghapus');
        
        alert("Pengumuman berhasil dihapus.");
        fetchAnnouncements(); // Refresh tabel
        
      } catch (error) {
        alert("Gagal menghapus pengumuman.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Pengumuman</h1>

      {/* Bagian 1: Panel MEMBUAT (kirim 'onSuccess' untuk refresh) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Buat Pengumuman Baru</h2>
        <PanelPengumuman 
          pembuat="Admin" 
          onSuccess={fetchAnnouncements} 
        />
      </div>

      {/* Bagian 2: Panel RIWAYAT (kirim data dan fungsi hapus) */}
      <div>
        <RiwayatPengumuman 
          announcements={announcements}
          isLoading={isLoading}
          onHapus={handleHapus}
        />
      </div>
    </div>
  );
}
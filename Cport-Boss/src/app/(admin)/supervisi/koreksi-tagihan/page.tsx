// Isi untuk: src/app/(admin)/supervisi/koreksi-tagihan/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelKoreksiTagihan from "@/components/supervisi/TabelKoreksiTagihan";

export const metadata: Metadata = {
  title: "Koreksi Tagihan Sales (Eksklusif) | Cport",
  description: "Edit atau hapus tagihan sales jika terjadi kesalahan (Supervisi Boss)",
};

export default function KoreksiTagihanPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Koreksi Tagihan Sales</h1>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
          Eksklusif Boss
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Hanya Anda yang dapat mengedit atau menghapus data tagihan sales jika terjadi kesalahan input oleh Admin. Semua tindakan terekam di Log Audit.
      </p>

      {/* Komponen Tabel Koreksi Tagihan kita */}
      <TabelKoreksiTagihan />
      
    </div>
  );
}
// Isi untuk: src/app/(admin)/data-master/toko/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel read-only yang baru kita buat
import TabelTokoReadOnly from "@/components/datamaster/TabelTokoReadOnly";

export const metadata: Metadata = {
  title: "Data Toko (Read-Only) | Cport",
  description: "Lihat daftar semua toko pelanggan (Supervisi Boss)",
};

export default function DataTokoPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Toko (Pelanggan)</h1>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
          Read-Only (Tampilan Boss)
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Halaman ini menampilkan daftar toko yang dikelola oleh Admin.
      </p>

      {/* Komponen Tabel Toko kita */}
      <TabelTokoReadOnly />
      
    </div>
  );
}
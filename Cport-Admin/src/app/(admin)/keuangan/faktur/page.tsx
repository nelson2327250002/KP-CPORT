// Isi untuk: src/app/(admin)/keuangan/faktur/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelFaktur from "@/components/keuangan/TabelFaktur";

export const metadata: Metadata = {
  title: "Faktur Penjualan | Cport",
  description: "Lihat dan ekspor faktur penjualan",
};

export default function FakturPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Faktur Penjualan</h1>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
          Penomoran Otomatis
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Daftar faktur yang dibuat otomatis oleh sistem. Gunakan tombol "Ekspor PDF" untuk mencetak.
      </p>

      {/* Komponen Tabel Faktur kita */}
      <TabelFaktur />
      
    </div>
  );
}
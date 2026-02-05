// Isi untuk: src/app/(admin)/data-master/produk/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelProduk from "@/components/datamaster/TabelProduk";

export const metadata: Metadata = {
  title: "Data Produk | Cport",
  description: "Lihat daftar semua produk (Read-Only)",
};

export default function DataProdukPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Master: Produk</h1>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
          Read-Only
        </span>
      </div>

      {/* Komponen Tabel Produk kita */}
      <TabelProduk />
      
    </div>
  );
}
// Isi untuk: src/app/(admin)/data-master/produk/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelProduk from "@/components/datamaster/TabelProduk";

export const metadata: Metadata = {
  title: "Manajemen Produk (Eksklusif) | Cport",
  description: "Tambah, edit, dan hapus data master produk & kategori",
};

export default function ProdukPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Produk & Kategori</h1>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
          Eksklusif Boss
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Hanya Anda yang dapat menambah, mengedit, dan menghapus katalog produk.
      </p>

      {/* Komponen Tabel Produk kita */}
      <TabelProduk />
      
    </div>
  );
}
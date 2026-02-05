// Isi untuk: src/app/(admin)/data-master/kategori/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen baru kita
import ManajemenKategori from "@/components/datamaster/ManajemenKategori";

export const metadata: Metadata = {
  title: "Manajemen Kategori | Cport",
  description: "Tambah atau hapus kategori produk",
};

export default function KategoriPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Kategori Produk</h1>

      {/* 2. Tampilkan komponennya */}
      <ManajemenKategori />
      
    </div>
  );
}
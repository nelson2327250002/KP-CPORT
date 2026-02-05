// Isi untuk: src/app/(admin)/data-master/produk/baru/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormProduk from "@/components/datamaster/FormProduk";

export const metadata: Metadata = {
  title: "Tambah Produk Baru | Cport",
  description: "Formulir untuk menambah produk atau kategori baru",
};

export default function TambahProdukPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>

      {/* 2. Kita panggil FormProduk di sini.
        Karena kita tidak memberi 'prop' apapun, 
        komponen ini otomatis akan masuk ke mode "Tambah Baru".
      */}
      <FormProduk />
      
    </div>
  );
}
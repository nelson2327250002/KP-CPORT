// Isi untuk: src/app/(admin)/stok/masuk/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormStokMasuk from "@/components/stok/FormStokMasuk";

export const metadata: Metadata = {
  title: "Stok Masuk (Stock In) | Cport",
  description: "Formulir untuk mencatat barang masuk dari supplier",
};

export default function StokMasukPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stok Masuk (Stock In)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gunakan formulir ini untuk menambah jumlah stok produk yang baru datang dari supplier.
      </p>

      {/* Komponen Formulir kita */}
      <FormStokMasuk />
      
    </div>
  );
}
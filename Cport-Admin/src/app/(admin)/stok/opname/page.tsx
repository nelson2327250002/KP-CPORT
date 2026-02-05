// Isi untuk: src/app/(admin)/stok/opname/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormStockOpname from "@/components/stok/FormStockOpname";

export const metadata: Metadata = {
  title: "Stock Opname | Cport",
  description: "Formulir untuk penyesuaian stok fisik vs stok sistem",
};

export default function StockOpnamePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stock Opname (Penyesuaian Stok)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gunakan formulir ini jika jumlah stok fisik di gudang berbeda dengan stok di sistem.
      </p>

      {/* Komponen Formulir kita */}
      <FormStockOpname />
      
    </div>
  );
}
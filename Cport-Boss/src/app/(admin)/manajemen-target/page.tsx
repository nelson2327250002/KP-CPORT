// Isi untuk: src/app/(admin)/manajemen-target/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormManajemenTarget from "@/components/target/FormManajemenTarget";

export const metadata: Metadata = {
  title: "Manajemen Target Sales | Cport",
  description: "Atur target penjualan bulanan untuk tim sales",
};

export default function ManajemenTargetPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Target Sales</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Pilih bulan dan masukkan target penjualan untuk setiap sales.
      </p>

      {/* 2. Komponen Formulir kita */}
      <FormManajemenTarget />
      
    </div>
  );
}
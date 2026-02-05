// Isi untuk: src/app/(admin)/data-master/toko/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelToko from "@/components/datamaster/TabelToko";

export const metadata: Metadata = {
  title: "Data Toko (Pelanggan) | Cport",
  description: "Kelola data toko pelanggan",
};

export default function DataTokoPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">Data Master: Toko (Pelanggan)</h1>
      
      {/* Komponen Tabel Toko kita */}
      <TabelToko />
      
    </div>
  );
}
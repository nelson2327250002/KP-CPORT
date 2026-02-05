// Isi untuk: src/app/(admin)/pesanan/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelPesanan from "@/components/pesanan/TabelPesanan";

export const metadata: Metadata = {
  title: "Manajemen Pesanan | Cport",
  description: "Kelola semua pesanan masuk",
};

export default function PesananPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>

      {/* Komponen Tabel Pesanan kita */}
      <TabelPesanan />
      
    </div>
  );
}
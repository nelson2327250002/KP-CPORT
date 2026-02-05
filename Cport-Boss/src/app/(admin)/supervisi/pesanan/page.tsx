// Isi untuk: src/app/(admin)/supervisi/pesanan/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelSemuaPesanan from "@/components/supervisi/TabelSemuaPesanan";

export const metadata: Metadata = {
  title: "Supervisi Pesanan | Cport",
  description: "Lihat dan filter semua pesanan (Supervisi Boss)",
};

export default function SupervisiPesananPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Supervisi Semua Pesanan</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gunakan filter untuk mencari semua pesanan berdasarkan nama toko atau status.
      </p>

      {/* Komponen Tabel Semua Pesanan kita */}
      <TabelSemuaPesanan />
      
    </div>
  );
}
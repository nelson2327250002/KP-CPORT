// Isi untuk: src/app/(admin)/riwayat-pesanan/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita akan impor komponen riwayat baru (TabelRiwayat)
import TabelRiwayat from "@/components/pesanan/TabelRiwayat"; 

export const metadata: Metadata = {
  title: "Riwayat Pemesanan | Cport",
  description: "Lihat dan filter riwayat pesanan yang telah selesai",
};

export default function RiwayatPesananPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Riwayat Pemesanan (Selesai)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gunakan filter untuk mencari riwayat pesanan berdasarkan nama toko atau status.
      </p>

      {/* 2. Komponen Tabel Riwayat kita */}
      <TabelRiwayat />
      
    </div>
  );
}
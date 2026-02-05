// Isi untuk: src/app/(admin)/keuangan/laporan-pajak/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen laporan yang baru kita buat
import LaporanPajak from "@/components/keuangan/LaporanPajak";

export const metadata: Metadata = {
  title: "Laporan Pajak (PPN) | Cport",
  description: "Rekapitulasi PPN Keluaran untuk diekspor ke PDF",
};

export default function LaporanPajakPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Laporan Pajak (PPN Keluaran)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Pilih bulan laporan lalu ekspor PDF untuk rekapitulasi PPN Keluaran.
      </p>

      {/* Komponen Laporan Pajak kita */}
      <LaporanPajak />
      
    </div>
  );
}
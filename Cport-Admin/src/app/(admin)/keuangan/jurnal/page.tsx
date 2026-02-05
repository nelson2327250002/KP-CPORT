// Isi untuk: src/app/(admin)/keuangan/jurnal/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelJurnal from "@/components/keuangan/TabelJurnal";

export const metadata: Metadata = {
  title: "Jurnal Akuntansi (Read-Only) | Cport",
  description: "Lihat jurnal umum (immutable) dari semua transaksi",
};

export default function JurnalPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jurnal Akuntansi</h1>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
          Immutable (Read-Only)
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Sesuai spesifikasi, seluruh transaksi tercatat permanen dan tidak bisa diedit/dihapus oleh Admin.
      </p>

      {/* Komponen Tabel Jurnal kita */}
      <TabelJurnal />
      
    </div>
  );
}
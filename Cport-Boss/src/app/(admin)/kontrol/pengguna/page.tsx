// Isi untuk: src/app/(admin)/kontrol/pengguna/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen tabel yang baru kita buat
import TabelPengguna from "@/components/kontrol/TabelPengguna";

export const metadata: Metadata = {
  title: "Manajemen Pengguna (Eksklusif) | Cport",
  description: "Tambah, edit, dan hapus akun Admin & Sales",
};

export default function PenggunaPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Pengguna & Hak Akses</h1>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
          Eksklusif Boss
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Hanya Anda yang dapat menambah, mengedit (mengganti role), dan menghapus akun pengguna.
      </p>

      {/* Komponen Tabel Pengguna kita */}
      <TabelPengguna />
      
    </div>
  );
}
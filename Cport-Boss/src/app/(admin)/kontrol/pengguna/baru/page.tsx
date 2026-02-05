// Isi untuk: src/app/(admin)/kontrol/pengguna/baru/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormPengguna from "@/components/kontrol/FormPengguna";

export const metadata: Metadata = {
  title: "Tambah Pengguna Baru | Cport",
  description: "Formulir untuk menambah akun Admin atau Sales baru",
};

export default function TambahPenggunaPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tambah Pengguna Baru</h1>

      {/* 2. Kita panggil FormPengguna di sini.
        Karena kita tidak memberi 'prop' pengguna, 
        komponen ini otomatis akan masuk ke mode "Tambah Baru".
      */}
      <FormPengguna />
      
    </div>
  );
}
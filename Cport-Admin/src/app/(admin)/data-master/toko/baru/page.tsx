// Isi untuk: src/app/(admin)/data-master/toko/baru/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormToko from "@/components/datamaster/FormToko";

export const metadata: Metadata = {
  title: "Tambah Toko Baru | Cport",
  description: "Formulir untuk menambah data toko pelanggan baru",
};

export default function TambahTokoPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tambah Toko Baru</h1>

      {/* 2. Kita panggil komponen FormToko di sini.
        Karena kita tidak memberi 'props' apapun, 
        komponen ini otomatis akan masuk ke mode "Tambah Baru".
      */}
      <FormToko />
      
    </div>
  );
}
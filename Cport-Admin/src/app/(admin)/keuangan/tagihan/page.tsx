// Isi BARU untuk: src/app/(admin)/keuangan/tagihan/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir
import FormUploadTagihan from "@/components/keuangan/FormUploadTagihan";
// 2. ⬇️ KITA IMPOR KOMPONEN TABEL BARU KITA ⬇️
import TabelTagihanSales from "@/components/keuangan/TabelTagihanSales";

export const metadata: Metadata = {
  title: "Tagihan Sales | Cport",
  description: "Upload tagihan dan konfirmasi pembayaran untuk sales",
};

export default function TagihanSalesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      
      {/* Bagian 1: Formulir Upload Tagihan Baru */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Upload Tagihan Sales</h1>
        <FormUploadTagihan />
      </div>

      {/* Bagian 2: Riwayat Tagihan */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Riwayat Tagihan</h2>
        
        {/* 3. ⬇️ GANTI PLACEHOLDER DENGAN INI ⬇️ */}
        <TabelTagihanSales />
        
      </div>
      
    </div>
  );
}
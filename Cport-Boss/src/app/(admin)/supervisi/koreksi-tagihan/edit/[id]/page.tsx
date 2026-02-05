// Isi BARU untuk: src/app/(admin)/supervisi/koreksi-tagihan/edit/[id]/page.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import hook
import { useParams } from "next/navigation"; 
import FormKoreksiTagihan from "@/components/supervisi/FormKoreksiTagihan";

// 2. Tipe data Tagihan (HARUS SAMA DENGAN API)
type Tagihan = {
  id: number;
  salesId: string;
  salesName: string;
  tanggalNota: string;
  jumlah: number;
  deskripsi: string;
  status: 'BELUM LUNAS' | 'LUNAS';
};

export default function EditTagihanPage() {
  const params = useParams(); 
  const idTagihan = params.id as string;
  
  // 3. State untuk data live
  const [tagihan, setTagihan] = useState<Tagihan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Ambil data 'satu tagihan' dari API
  useEffect(() => {
    if (!idTagihan) return;
    
    const fetchTagihan = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/sales-invoices/${idTagihan}`);
        if (!response.ok) {
          throw new Error('Data tagihan tidak ditemukan');
        }
        const data = await response.json();
        setTagihan(data);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data tagihan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagihan();
  }, [idTagihan]); // Ambil data saat 'idTagihan' berubah

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        Memuat data tagihan...
      </div>
    );
  }

  if (!tagihan) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center text-red-500">
        Data tagihan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Koreksi Tagihan: #{tagihan.id}</h1>
      
      {/* 5. Berikan data 'tagihan' asli ke formulir */}
      <FormKoreksiTagihan tagihan={tagihan} />
      
    </div>
  );
}
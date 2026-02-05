// Isi BARU untuk: src/app/(admin)/data-master/toko/edit/[id]/page.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import hook
import { useParams } from "next/navigation"; 
import FormToko from "@/components/datamaster/FormToko"; // 2. Impor formulir

// 3. Tipe data (HARUS SAMA DENGAN API)
type Store = {
  id: number;
  nama: string;
  alamat: string;
  namaBoss: string;
  kontakBoss: string;
};

export default function EditTokoPage() {
  const params = useParams(); 
  const idToko = params.id as string;
  
  // 4. State untuk data live
  const [toko, setToko] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 5. Ambil data 'satu toko' dari API
  useEffect(() => {
    if (!idToko) return;
    
    const fetchStore = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/stores/${idToko}`);
        if (!response.ok) {
          throw new Error('Data toko tidak ditemukan');
        }
        const data = await response.json();
        setToko(data);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data toko.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [idToko]); // Ambil data saat 'idToko' berubah

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        Memuat data toko...
      </div>
    );
  }

  if (!toko) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center text-red-500">
        Data toko tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Toko: {toko.nama}</h1>
      
      {/* 6. Berikan data 'toko' asli ke formulir */}
      <FormToko toko={toko} />
      
    </div>
  );
}
// Isi BARU untuk: src/app/(admin)/kontrol/pengguna/edit/[id]/page.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import hook
import { useParams } from "next/navigation"; 
import FormPengguna from "@/components/kontrol/FormPengguna";

// Tipe data User
type User = {
  id: string;
  nama: string;
  email: string;
  role: "Admin" | "Sales"; // Sesuaikan jika 'Boss' juga bisa diedit
};

export default function EditPenggunaPage() {
  const params = useParams(); 
  const idPengguna = params.id as string;
  
  // 2. State untuk menyimpan data pengguna dan status loading
  const [pengguna, setPengguna] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fungsi untuk mengambil data 'satu pengguna' dari API
  useEffect(() => {
    if (!idPengguna) return;
    
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/users/${idPengguna}`);
        if (!response.ok) {
          throw new Error('Data pengguna tidak ditemukan');
        }
        const data = await response.json();
        setPengguna(data);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data pengguna.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [idPengguna]); // Ambil data saat 'idPengguna' berubah

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        Memuat data pengguna...
      </div>
    );
  }

  if (!pengguna) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center text-red-500">
        Data pengguna tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Pengguna: {pengguna.nama}</h1>
      
      {/* 4. Berikan data 'pengguna' asli ke formulir */}
      <FormPengguna pengguna={pengguna} />
      
    </div>
  );
}
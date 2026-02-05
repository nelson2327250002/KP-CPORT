// Isi BARU untuk: src/app/(admin)/data-master/produk/edit/[id]/page.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import hook
import { useParams } from "next/navigation"; 
import FormProduk from "@/components/datamaster/FormProduk";

// Tipe data Product
type Product = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

export default function EditProdukPage() {
  const params = useParams(); 
  const idProduk = params.id as string;
  
  // 2. State untuk menyimpan data produk dan status loading
  const [produk, setProduk] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fungsi untuk mengambil data 'satu produk' dari API
  useEffect(() => {
    if (!idProduk) return;
    
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/products/${idProduk}`);
        if (!response.ok) {
          throw new Error('Data produk tidak ditemukan');
        }
        const data = await response.json();
        setProduk(data);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [idProduk]); // Ambil data saat 'idProduk' berubah

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        Memuat data produk...
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center text-red-500">
        Data produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Produk: {produk.nama}</h1>
      
      {/* 4. Berikan data 'produk' asli ke formulir */}
      <FormProduk produk={produk} />
      
    </div>
  );
}
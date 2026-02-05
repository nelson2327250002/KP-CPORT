// Isi BARU untuk: src/app/(admin)/data-master/produk/[id]/page.tsx

"use client"; // 1. Wajib ditambahkan

import React, { useState, useEffect } from "react"; 
import { useParams } from "next/navigation"; // 2. Import hook 'useParams'

// 3. Tipe data (HARUS SAMA DENGAN API)
type Product = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function ProdukDetailPage() {
  const params = useParams(); // 4. Gunakan hook 'useParams'
  const productId = params.id as string; // { id: '1' }

  // 5. State untuk data live
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 6. Fungsi fetch data (mengambil satu produk)
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) {
          throw new Error("Produk tidak ditemukan");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Ambil data setiap kali ID berubah

  // 7. Tampilkan status Loading
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <p className="mt-4">Memuat data produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-3xl font-bold text-red-500">Produk tidak ditemukan.</h1>
      </div>
    );
  }

  // 8. Tampilkan data live
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detail Produk: {product.nama}</h1>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
          Read-Only (Tampilan Admin)
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Produk</label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">P-{product.id.toString().padStart(3, '0')}</p>
          </div>
          <hr className="dark:border-gray-700" />
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Produk</label>
            <p className="text-lg text-gray-900 dark:text-white">{product.nama}</p>
          </div>
          <hr className="dark:border-gray-700" />
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</label>
            <p className="text-lg text-gray-900 dark:text-white">{product.kategori}</p>
          </div>
          <hr className="dark:border-gray-700" />
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Harga Jual (Master)</label>
            <p className="text-lg text-gray-900 dark:text-white">{formatRupiah(product.harga)}</p>
          </div>
          <hr className="dark:border-gray-700" />
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stok Saat Ini</label>
            <p className={`text-2xl font-bold ${
                product.stok === 0 ? 'text-red-500' : (product.stok <= 99 ? 'text-yellow-600' : 'text-green-600')
              }`}>
              {product.stok} Unit
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
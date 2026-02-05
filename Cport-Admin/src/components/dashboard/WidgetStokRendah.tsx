// Isi BARU untuk: src/components/dashboard/WidgetStokRendah.tsx

"use client"; 
import React, { useState, useEffect } from "react"; 
import Link from "next/link"; 

// Tipe data (HARUS SAMA DENGAN API)
type Product = {
  id: number;
  nama: string;
  stok: number;
};

// 1. Kunci untuk penyimpanan di browser
const STORAGE_KEY = 'readLowStockIds';

export default function WidgetStokRendah() {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fungsi untuk mengambil data DAN memfilternya
  const fetchAndFilterLowStock = async () => {
    try {
      // Ambil ID yang sudah dibaca dari Local Storage
      const readIdsString = localStorage.getItem(STORAGE_KEY);
      const readIds = readIdsString ? JSON.parse(readIdsString) : [];

      // Ambil data live dari API
      const response = await fetch('http://localhost:3000/products/low-stock');
      const allLowStock: Product[] = await response.json();

      // Filter: Hanya tampilkan yang BELUM ada di 'readIds'
      const unreadProducts = allLowStock.filter(
        (product) => !readIds.includes(product.id)
      );
      
      setVisibleProducts(unreadProducts);

    } catch (error) {
      console.error("Gagal mengambil data stok rendah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Ambil data saat dimuat, dan refresh setiap 10 detik
  useEffect(() => {
    fetchAndFilterLowStock(); // Ambil data pertama kali
    
    const interval = setInterval(() => {
      fetchAndFilterLowStock(); // Ambil data setiap 10 detik
    }, 10000); 

    return () => clearInterval(interval); // Matikan timer
  }, []);

  // 4. ⬇️ FUNGSI BARU: Tandai "Sudah Dibaca" ⬇️
  const handleMarkAsRead = (id: number) => {
    // Ambil daftar ID yang sudah ada
    const readIdsString = localStorage.getItem(STORAGE_KEY);
    const readIds = readIdsString ? JSON.parse(readIdsString) : [];
    
    // Tambahkan ID baru jika belum ada
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReadIds));
    }
    
    // Sembunyikan item ini dari UI secara langsung
    setVisibleProducts(
      visibleProducts.filter(p => p.id !== id)
    );
    
    // (Navigasi akan dilanjutkan oleh <Link>)
  };
  // ⬆️ ----------------------------------- ⬆️

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Memuat data stok...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Stok aman (atau sudah dibaca).</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visibleProducts.map((item) => (
            <li 
              key={item.id} 
              className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.nama}</p>
                <p className={`text-sm ${
                  item.stok === 0 ? 'text-red-500 font-bold' : 'text-yellow-500'
                }`}>
                  {item.stok === 0 ? 'Habis' : 'Stok Menipis'} - Sisa {item.stok}
                </p>
              </div>
              
              {/* 5. ⬇️ Tambahkan onClick ke Link ⬇️ */}
              <Link 
                href={`/data-master/produk/${item.id}`}
                onClick={() => handleMarkAsRead(item.id)} // <-- TAMBAHKAN INI
              >
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Lihat
                </span>
              </Link>
              {/* ⬆️ ------------------------- ⬆️ */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
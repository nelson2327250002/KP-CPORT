// Isi BARU untuk: src/components/dashboard/WidgetPesananBaru.tsx

"use client"; 

import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { usePathname } from 'next/navigation'; // Import hook untuk deteksi halaman

// Tipe data (HARUS SAMA DENGAN API)
type Order = {
  id: number;
  fakturId: string | null;
  namaToko: string;
  totalKeseluruhan: number;
  status: 'Menunggu Diproses' | 'Sedang Dikirim' | 'Terkirim' | 'DIBATALKAN';
  tanggalPesanan: string;
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function WidgetPesananBaru() {
  const [visiblePesanan, setVisiblePesanan] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. ⬇️ FUNGSI FETCH DATA ⬇️
  const fetchNewOrders = async () => {
    // Jangan set loading jika ini hanya refresh background
    // setIsLoading(true); 
    
    try {
      const response = await fetch('http://localhost:3000/orders'); 
      const allOrders: Order[] = await response.json();
      
      // Filter HANYA yang 'Menunggu Diproses'
      const newOrders = allOrders.filter(
        (order) => order.status === 'Menunggu Diproses'
      );
      
      setVisiblePesanan(newOrders);

    } catch (error) {
      console.error("Gagal mengambil pesanan baru:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. ⬇️ LOGIKA AUTO-REFRESH (POLLING) ⬇️
  useEffect(() => {
    // 1. Ambil data pertama kali saat dimuat
    fetchNewOrders();

    // 2. Buat timer untuk mengambil data setiap 10 detik
    const interval = setInterval(() => {
      console.log("Memeriksa pesanan baru...");
      fetchNewOrders();
    }, 10000); // 10000 ms = 10 detik

    // 3. Matikan timer saat komponen ditutup
    return () => clearInterval(interval);
  }, []); // [] berarti ini hanya berjalan sekali (saat komponen dibuat)
  // ⬆️ ----------------------------------- ⬆️

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[400px]">
      
      {isLoading ? (
         <div className="flex items-center justify-center h-full min-h-[300px]">
          <p className="text-gray-500">Memuat...</p>
        </div>
      ) : visiblePesanan.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada pesanan baru saat ini.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {visiblePesanan.map((pesanan) => (
            <li key={pesanan.id}>
              <Link href={`/pesanan/${pesanan.id}`}>
                <div className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">
                      {pesanan.fakturId || `Order #${pesanan.id}`}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(pesanan.tanggalPesanan).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white mt-1">
                    {pesanan.namaToko}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {formatRupiah(pesanan.totalKeseluruhan)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
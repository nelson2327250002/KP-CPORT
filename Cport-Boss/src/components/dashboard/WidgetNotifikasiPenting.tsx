// Isi BARU untuk: src/components/dashboard/WidgetNotifikasiPenting.tsx

"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 

// Tipe data
type LowStockProduct = {
  id: number;
  nama: string;
  stok: number;
};

type LargeTransaction = {
  id: number;
  fakturId: string | null;
  namaToko: string;
  totalKeseluruhan: number;
};

// Batas Transaksi Besar
const LARGE_TRANSACTION_THRESHOLD = 10000000; // 10 Juta

export default function WidgetNotifikasiPenting() {
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [largeTransactions, setLargeTransactions] = useState<LargeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // 1. Ambil data Stok Rendah
        const stockRes = await fetch('http://localhost:3000/products/low-stock');
        const stockData = await stockRes.json();
        setLowStock(stockData.slice(0, 2)); // Ambil 2 teratas

        // 2. Ambil data Transaksi Besar
        const orderRes = await fetch('http://localhost:3000/orders');
        const orderData = await orderRes.json();
        const largeOrders = orderData.filter(
          (order: any) => 
            order.totalKeseluruhan >= LARGE_TRANSACTION_THRESHOLD &&
            order.status === 'Menunggu Diproses' // Hanya notif pesanan baru
        );
        setLargeTransactions(largeOrders.slice(0, 2)); // Ambil 2 teratas

      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[200px]">
      {isLoading ? (
        <p className="text-gray-500">Memuat notifikasi...</p>
      ) : (
        <ul className="flex flex-col gap-4">
          
          {/* Tampilkan Transaksi Besar */}
          {largeTransactions.map((order) => (
            <li key={`order-${order.id}`} className="pb-2 border-b border-gray-200 dark:border-gray-700">
              <Link href={`/supervisi/pesanan/${order.id}`}>
                <div className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded-lg cursor-pointer">
                  <p className="font-semibold text-green-500">💰 Transaksi Besar</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    Pesanan baru {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalKeseluruhan)} dari {order.namaToko}.
                  </p>
                </div>
              </Link>
            </li>
          ))}

          {/* Tampilkan Stok Kritis */}
          {lowStock.map((item) => (
            <li key={`stock-${item.id}`} className="pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
              <Link href={`/data-master/produk`}>
                <div className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded-lg cursor-pointer">
                  <p className="font-semibold text-red-500">⚠️ Stok Kritis</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {item.nama} - Sisa {item.stok} unit.
                  </p>
                </div>
              </Link>
            </li>
          ))}

          {/* Jika keduanya kosong */}
          {lowStock.length === 0 && largeTransactions.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">Tidak ada peringatan baru.</p>
          )}

        </ul>
      )}
    </div>
  );
}
// Isi BARU untuk: src/components/pesanan/TabelPesanan.tsx

"use client";
import React, { useState, useEffect } from "react"; // 1. Import hook
import Link from "next/link";

// 2. Tipe data Order (HARUS SAMA DENGAN API)
type Order = {
  id: number; // Tipe number
  fakturId: string | null;
  namaToko: string;
  totalKeseluruhan: number;
  status: 'Menunggu Diproses' | 'Sedang Dikirim' | 'Terkirim' | 'DIBATALKAN';
  tanggalPesanan: string; // (Akan jadi string setelah JSON)
};

// ... (Fungsi getStatusClass tetap sama) ...
const getStatusClass = (status: string) => {
  switch (status) {
    case "Menunggu Diproses":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Sedang Dikirim":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Terkirim":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "DIBATALKAN":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function TabelPesanan() {
  // 3. State untuk data live
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fungsi fetch data
  const fetchActiveOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/orders'); // PANGGIL API
      const allOrders: Order[] = await response.json();
      
      // 5. Filter HANYA pesanan aktif
      const filtered = allOrders.filter(
        (order) =>
          order.status === 'Menunggu Diproses' ||
          order.status === 'Sedang Dikirim',
      );
      setActiveOrders(filtered);

    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      alert("Gagal mengambil data pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Ambil data saat dimuat
  useEffect(() => {
    fetchActiveOrders();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Daftar Pesanan Aktif ({activeOrders.length})
        </h3>
         <button 
          onClick={fetchActiveOrders} 
          disabled={isLoading}
          className="text-blue-600 text-sm disabled:opacity-50"
        >
          {isLoading ? "Memuat..." : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">No. Faktur</th>
              <th className="py-2">Toko</th>
              <th className="py-2">Tanggal</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* 7. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={5} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : activeOrders.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-gray-500">Tidak ada pesanan aktif.</td></tr>
            ) : (
              // 8. Map data 'activeOrders'
              activeOrders.map((pesanan) => (
                <tr key={pesanan.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">
                    <Link href={`/pesanan/${pesanan.id}`}>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {pesanan.fakturId || `Order #${pesanan.id}`}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3">{pesanan.namaToko}</td>
                  <td className="py-3">
                    {new Date(pesanan.tanggalPesanan).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 font-medium">
                    {formatRupiah(pesanan.totalKeseluruhan)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(pesanan.status)}`}>
                      {pesanan.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
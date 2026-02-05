// Isi BARU untuk: src/app/(admin)/supervisi/pesanan/[id]/page.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import hook
import { useParams } from "next/navigation";

// 2. Tipe data (HARUS SAMA DENGAN API)
type OrderItem = {
  id: number;
  productId: number;
  namaProduk: string;
  kuantitas: number;
  hargaSatuan: number;
  totalHarga: number;
};

type Order = {
  id: number;
  fakturId: string | null;
  namaToko: string;
  namaSales: string;
  totalKeseluruhan: number;
  status: 'Menunggu Diproses' | 'Sedang Dikirim' | 'Terkirim' | 'DIBATALKAN';
  tanggalPesanan: string;
  items: OrderItem[]; // Detail barang
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

export default function PesananDetailPage() {
  const params = useParams(); 
  const orderId = params.id as string; // ID dari URL

  // 3. State untuk data live
  const [pesanan, setPesanan] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Ambil data 'satu pesanan' dari API
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Data pesanan tidak ditemukan');
        }
        const data = await response.json();
        setPesanan(data);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]); // Ambil data saat 'orderId' berubah

  // 5. Tampilkan status Loading / Error
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        Memuat data pesanan...
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center text-red-500">
        Data pesanan tidak ditemukan.
      </div>
    );
  }

  // 6. Tampilkan data live
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Detail Pesanan: {pesanan.fakturId || `#${pesanan.id}`}
        </h1>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
          Read-Only (Tampilan Boss)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Item Pesanan</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="py-2">Produk</th>
                <th className="py-2">Kuantitas</th>
                <th className="py-2">Harga Satuan</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.items.map((item) => (
                <tr key={item.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{item.namaProduk}</td>
                  <td className="py-3">{item.kuantitas}</td>
                  <td className="py-3">{formatRupiah(item.hargaSatuan)}</td>
                  <td className="py-3">{formatRupiah(item.totalHarga)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Informasi</h2>
          <div className="space-y-3">
            <p><strong>Toko:</strong> {pesanan.namaToko}</p>
            <p><strong>Sales:</strong> {pesanan.namaSales}</p>
            <p><strong>Tanggal:</strong> {new Date(pesanan.tanggalPesanan).toLocaleString('id-ID')}</p>
            <p><strong>Total:</strong> <span className="font-bold text-lg">{formatRupiah(pesanan.totalKeseluruhan)}</span></p>
            <p><strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(pesanan.status)}`}>
                {pesanan.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
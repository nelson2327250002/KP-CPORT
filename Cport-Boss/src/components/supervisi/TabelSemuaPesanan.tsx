// Isi BARU untuk: src/components/supervisi/TabelSemuaPesanan.tsx

"use client"; 
import React, { useState, useEffect } from "react"; // 1. Import hook
import Link from "next/link";

// 2. Tipe data Order (HARUS SAMA DENGAN DI API)
type Order = {
  id: number; // Tipe number
  fakturId: string | null;
  namaToko: string;
  namaSales: string;
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

export default function TabelSemuaPesanan() {
  // 3. State untuk data live
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchToko, setSearchToko] = useState("");

  // 4. Fungsi untuk mengambil data dari "mesin"
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/orders'); // PANGGIL API
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      alert("Gagal mengambil data pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchOrders();
  }, []);

  // 6. Logika filter (sekarang berjalan di data 'orders' live)
  const pesananYangTampil = orders.filter(pesanan => {
    const statusMatch = (filterStatus === "Semua") || (pesanan.status === filterStatus);
    const searchMatch = pesanan.namaToko.toLowerCase().includes(searchToko.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Fungsi format mata uang
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      
      {/* ... (Filter dan Search Bar tetap sama) ... */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b dark:border-gray-700">
        <div>
          <label htmlFor="searchToko" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cari Nama Toko
          </label>
          <input
            type="text"
            id="searchToko"
            className="w-full md:w-64 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ketik nama toko..."
            value={searchToko}
            onChange={(e) => setSearchToko(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter Status
          </label>
          <select
            id="filterStatus"
            className="w-full md:w-auto p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Diproses">Menunggu Diproses</option>
            <option value="Sedang Dikirim">Sedang Dikirim</option>
            <option value="Terkirim">Terkirim (Selesai)</option>
            <option value="DIBATALKAN">Dibatalkan</option>
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">
        Menampilkan {pesananYangTampil.length} pesanan
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            {/* 7. Kita tambahkan 'Nama Sales' */}
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">No. Faktur</th>
              <th className="py-2">Toko</th>
              <th className="py-2">Sales</th>
              <th className="py-2">Tanggal</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* 8. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : pesananYangTampil.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Tidak ada pesanan.</td></tr>
            ) : (
              pesananYangTampil.map((pesanan) => (
                <tr key={pesanan.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">
                    {/* Link ke detail (ID sekarang number) */}
                    <Link href={`/supervisi/pesanan/${pesanan.id}`}>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {pesanan.fakturId || `Order #${pesanan.id}`}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3">{pesanan.namaToko}</td>
                  <td className="py-3">{pesanan.namaSales}</td>
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
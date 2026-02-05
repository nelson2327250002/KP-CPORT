// Isi BARU untuk: src/components/keuangan/TabelFaktur.tsx

"use client"; 
import React, { useState, useEffect } from "react"; // 1. Import hook
import Link from "next/link"; 

// 2. Tipe data Order (HARUS SAMA DENGAN API)
type Order = {
  id: number;
  fakturId: string | null;
  namaToko: string;
  totalKeseluruhan: number;
  status: 'Menunggu Diproses' | 'Sedang Dikirim' | 'Terkirim' | 'DIBATALKAN';
  tanggalPesanan: string;
};

// ... (Fungsi getStatusClass tetap sama) ...
const getStatusClass = (status: string) => {
  // (Anda bisa salin fungsi getStatusClass dari file TabelPesanan.tsx)
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

export default function TabelFaktur() {
  // 3. State untuk data live
  const [fakturList, setFakturList] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fungsi fetch data
  const fetchFaktur = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/orders'); // PANGGIL API
      const allOrders: Order[] = await response.json();
      
      // 5. Filter (Hanya tampilkan yang sudah diproses/selesai)
      const filtered = allOrders.filter(
        (order) =>
          order.status === 'Sedang Dikirim' ||
          order.status === 'Terkirim'
      );
      setFakturList(filtered);

    } catch (error) {
      console.error("Gagal mengambil data faktur:", error);
      alert("Gagal mengambil data faktur.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Ambil data saat dimuat
  useEffect(() => {
    fetchFaktur();
  }, []);

  // 7. Fungsi Ekspor PDF (Placeholder)
  const handleEksporPDF = (fakturId: string) => {
    alert(`Logika EKSPOR PDF untuk Faktur: ${fakturId}`);
    // Nanti di sini logika untuk generate PDF
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Daftar Faktur Penjualan</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">No. Faktur</th>
              <th className="py-2">Tanggal</th>
              <th className="py-2">Toko</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* 8. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : fakturList.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Belum ada faktur yang dibuat.</td></tr>
            ) : (
              fakturList.map((faktur) => (
                <tr key={faktur.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">
                    {/* Link ke detail pesanan */}
                    <Link href={`/pesanan/${faktur.id}`}>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {faktur.fakturId || `Order #${faktur.id}`}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3">
                    {new Date(faktur.tanggalPesanan).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3">{faktur.namaToko}</td>
                  <td className="py-3 font-medium">{formatRupiah(faktur.totalKeseluruhan)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(faktur.status)}`}>
                      {faktur.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {/* 9. Tombol Ekspor PDF (sesuai spek) */}
                    <button
                      onClick={() => handleEksporPDF(faktur.fakturId || `${faktur.id}`)}
                      className="text-green-600 hover:underline cursor-pointer text-sm"
                    >
                      Ekspor PDF
                    </button>
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
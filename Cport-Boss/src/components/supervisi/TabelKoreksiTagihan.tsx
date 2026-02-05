// Isi BARU untuk: src/components/supervisi/TabelKoreksiTagihan.tsx

"use client";
import React, { useState, useEffect } from "react"; // 1. Import hook
import Link from "next/link";

// 2. Tipe data (HARUS SAMA DENGAN API)
type SalesInvoice = {
  id: number;
  salesName: string;
  tanggalNota: string;
  deskripsi: string;
  jumlah: number;
  status: 'BELUM LUNAS' | 'LUNAS';
  fotoNotaUrl: string;
};

// ... (Fungsi getStatusClass tetap sama) ...
const getStatusClass = (status: string) => {
  switch (status) {
    case "BELUM LUNAS":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "LUNAS":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
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

export default function TabelKoreksiTagihan() {
  // 3. State untuk data live
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fungsi fetch data
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/sales-invoices'); // PANGGIL API
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Gagal mengambil data tagihan:", error);
      alert("Gagal mengambil data tagihan.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Ambil data saat dimuat
  useEffect(() => {
    fetchInvoices();
  }, []);

  // 6. Fungsi Hapus yang terhubung ke API
  const handleHapus = async (id: number) => {
    if (confirm(`Apakah Anda yakin ingin MENGHAPUS tagihan ini? \nAksi ini akan terekam di Log Audit.`)) {
      try {
        const response = await fetch(`http://localhost:3000/sales-invoices/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Gagal menghapus tagihan');
        alert("Tagihan berhasil dihapus.");
        fetchInvoices(); // Refresh tabel
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus tagihan.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Semua Tagihan Sales</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">ID Tagihan</th>
              <th className="py-2">Sales</th>
              <th className="py-2">Tanggal Nota</th>
              <th className="py-2">Deskripsi</th>
              <th className="py-2">Jumlah</th>
              <th className="py-2">Nota</th>
              <th className="py-2">Status</th>
              <th className="py-2">Aksi Koreksi (Boss)</th>
            </tr>
          </thead>
          <tbody>
            {/* 7. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={8} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={8} className="py-6 text-center text-gray-500">Belum ada data tagihan.</td></tr>
            ) : (
              // 8. Map data 'invoices' dari state
              invoices.map((tagihan) => (
                <tr key={tagihan.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{tagihan.id}</td>
                  <td className="py-3">{tagihan.salesName}</td>
                  <td className="py-3">
                    {new Date(tagihan.tanggalNota).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3">{tagihan.deskripsi}</td>
                  <td className="py-3 font-medium">{formatRupiah(tagihan.jumlah)}</td>
                  <td className="py-3">
                    {/* Nanti kita atur upload/view file */}
                    <Link href={tagihan.fotoNotaUrl} target="_blank" rel="noopener noreferrer">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Lihat Foto
                      </span>
                    </Link>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(tagihan.status)}`}>
                      {tagihan.status}
                    </span>
                  </td>
                  <td className="py-3 flex gap-3">
                    <Link href={`/supervisi/koreksi-tagihan/edit/${tagihan.id}`}>
                      <span className="text-yellow-500 hover:text-yellow-700 cursor-pointer">
                        Edit
                      </span>
                    </Link>
                    <button
                      onClick={() => handleHapus(tagihan.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
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
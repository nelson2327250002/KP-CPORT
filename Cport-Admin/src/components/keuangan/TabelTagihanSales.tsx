// Isi BARU untuk: src/components/keuangan/TabelTagihanSales.tsx

"use client"; 

import React, { useState, useEffect } from "react";
import Link from "next/link"; 

// ⬇️ ALAMAT "MESIN" API ANDA ⬇️
const API_BASE_URL = 'http://localhost:3000';

// Tipe data (HARUS SAMA DENGAN API)
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

export default function TabelTagihanSales() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi fetch data
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/sales-invoices`); 
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Gagal mengambil data tagihan:", error);
      alert("Gagal mengambil data tagihan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fungsi Hapus yang terhubung ke API
  const handleTandaiLunas = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menandai tagihan ini sebagai LUNAS?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/sales-invoices/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'LUNAS' }), 
        });

        if (!response.ok) throw new Error('Gagal mengupdate status');
        
        alert("Status tagihan berhasil diubah menjadi LUNAS.");
        fetchInvoices(); // Refresh tabel

      } catch (error) {
        console.error(error);
        alert("Gagal mengupdate status tagihan.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Riwayat Tagihan</h3>
        <button 
          onClick={fetchInvoices} 
          disabled={isLoading}
          className="text-blue-600 text-sm disabled:opacity-50"
        >
          {isLoading ? "Memuat..." : "Refresh"}
        </button>
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
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={8} className="py-6 text-center text-gray-500">Belum ada data tagihan.</td></tr>
            ) : (
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
                    
                    {/* ⬇️ PERBAIKAN DI SINI ⬇️ */}
                    <Link 
                      href={`${API_BASE_URL}${tagihan.fotoNotaUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Lihat Foto
                    </Link>
                    {/* ⬆️ --------------------- ⬆️ */}

                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(tagihan.status)}`}>
                      {tagihan.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {tagihan.status === "BELUM LUNAS" && (
                      <button
                        onClick={() => handleTandaiLunas(tagihan.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium"
                      >
                        Tandai LUNAS
                      </button>
                    )}
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
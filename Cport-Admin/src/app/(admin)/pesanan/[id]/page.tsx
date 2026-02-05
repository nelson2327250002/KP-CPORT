// Isi BARU untuk: src/app/(admin)/pesanan/[id]/page.tsx

"use client"; 

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Tipe data (HARUS SAMA DENGAN API)
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
  items: OrderItem[];
};

// Fungsi styling status
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
  const router = useRouter(); 
  const orderId = params.id as string;

  // State untuk data live
  const [pesanan, setPesanan] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // State untuk loading tombol
  const [menuAksiTerbuka, setMenuAksiTerbuka] = useState(false);

  // Fungsi fetch data
  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/orders/${orderId}`);
      if (!response.ok) throw new Error('Data pesanan tidak ditemukan');
      const data = await response.json();
      setPesanan(data);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data saat dimuat
  useEffect(() => {
    fetchOrder();
  }, [orderId]); // Ambil data saat orderId berubah

  // Fungsi Aksi yang terhubung ke API
  const handleUpdateStatus = async (status: 'Sedang Dikirim' | 'Terkirim' | 'DIBATALKAN') => {
    let confirmMessage = `Apakah Anda yakin ingin mengubah status menjadi "${status}"?`;
    if (status === 'DIBATALKAN') {
      confirmMessage = "YAKIN BATALKAN PESANAN? Aksi ini akan membuat jurnal pembalik.";
    }
    
    if (confirm(confirmMessage)) {
      try {
        setIsUpdating(true); 
        setMenuAksiTerbuka(false);
        
        const response = await fetch(`http://localhost:3000/orders/${pesanan!.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: status }), // Kirim status baru
        });

        if (!response.ok) throw new Error('Gagal mengupdate status pesanan');

        alert(`Status pesanan berhasil diubah menjadi "${status}"!`);
        
        // Jika Batal atau Terkirim, arahkan kembali ke daftar
        if (status === 'Terkirim' || status === 'DIBATALKAN') {
          router.push('/pesanan'); // Arahkan ke daftar Pesanan Aktif
        } else {
          // Jika tidak (Proses), refresh data di halaman ini
          fetchOrder(); 
        }

      } catch (error) {
        console.error(error);
        alert("Gagal mengupdate status.");
      } finally {
        setIsUpdating(false); // Selesai loading
      }
    }
  };

  // Tampilkan status Loading / Error
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

  // Tampilkan data live
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Detail Pesanan: {pesanan.fakturId || `#${pesanan.id}`}
      </h1>

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

          <hr className="my-6 dark:border-gray-700" />
          
          <h2 className="text-xl font-semibold mb-4">Aksi</h2>
          
          {/* Tombol Aksi yang Terhubung ke API */}
          {pesanan.status === "Terkirim" ? (
            <div className="p-4 text-center bg-green-100 text-green-800 rounded-lg dark:bg-green-900 dark:text-green-200">
              Pesanan ini telah selesai.
            </div>
          ) : pesanan.status === "DIBATALKAN" ? (
            <div className="p-4 text-center bg-red-100 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
              Pesanan ini telah dibatalkan.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <button
                  onClick={() => setMenuAksiTerbuka(!menuAksiTerbuka)}
                  disabled={isUpdating} 
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex justify-between items-center disabled:opacity-50"
                >
                  <span>{isUpdating ? "Memproses..." : "Ubah Status..."}</span>
                  <svg className={`w-5 h-5 transition-transform ${menuAksiTerbuka ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {menuAksiTerbuka && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => handleUpdateStatus('Sedang Dikirim')}
                          disabled={pesanan.status !== "Menunggu Diproses" || isUpdating}
                          className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Proses Pesanan & Kurangi Stok
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleUpdateStatus('Terkirim')}
                          disabled={pesanan.status !== "Sedang Dikirim" || isUpdating}
                          className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Tandai sebagai Terkirim (Selesai)
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleUpdateStatus('DIBATALKAN')}
                disabled={isUpdating}
                className="w-full px-4 py-2 bg-transparent text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors font-medium border border-red-600 disabled:opacity-50"
              >
                Batalkan Pesanan Ini
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
// Isi BARU untuk: src/components/datamaster/TabelProduk.tsx

"use client"; 
import React, { useState, useEffect } from "react"; 
import Link from "next/link"; 

type Product = {
  id: number; 
  nama: string;
  kategori: string;
  harga: number; // <-- TAMBAHKAN
  stok: number;
};

// Fungsi formatter ID
const formatProductId = (id: number) => {
  return `P-${id.toString().padStart(3, '0')}`; 
};

// 1. ⬇️ FUNGSI FORMATTER BARU ⬇️
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function TabelProduk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (Fungsi fetchProducts tetap sama) ...
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/products'); 
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      alert("Gagal mengambil data produk.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ... (Fungsi handleHapus tetap sama) ...
  const handleHapus = async (id: number, nama: string) => { 
    if (confirm(`Apakah Anda yakin ingin menghapus produk ${nama}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Gagal menghapus produk');
        alert(`Produk ${nama} berhasil dihapus.`);
        fetchProducts(); 
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus produk.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* ... (Tombol Tambah Baru tetap sama) ... */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Semua Katalog Produk</h3>
        <Link href="/data-master/produk/baru">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium">
            + Tambah Produk Baru
          </span>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]"> {/* 2. Dibuat lebih lebar */}
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">ID Produk</th>
              <th className="py-2">Nama Produk</th>
              <th className="py-2">Kategori</th>
              <th className="py-2">Harga Jual</th> {/* 3. ⬇️ KOLOM BARU ⬇️ */}
              <th className="py-2">Stok Saat Ini</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Belum ada data produk.</td></tr>
            ) : (
              products.map((produk) => (
                <tr key={produk.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{formatProductId(produk.id)}</td>
                  <td className="py-3">{produk.nama}</td>
                  <td className="py-3">{produk.kategori}</td>
                  {/* 4. ⬇️ DATA HARGA BARU ⬇️ */}
                  <td className="py-3 font-medium">{formatRupiah(produk.harga)}</td>
                  <td className="py-3">{produk.stok}</td>
                  <td className="py-3 flex gap-3">
                    <Link href={`/data-master/produk/edit/${produk.id}`}>
                      <span className="text-yellow-500 hover:text-yellow-700 cursor-pointer">
                        Edit
                      </span>
                    </Link>
                    <button
                      onClick={() => handleHapus(produk.id, produk.nama)}
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
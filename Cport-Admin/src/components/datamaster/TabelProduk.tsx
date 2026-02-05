// Isi BARU untuk: src/components/datamaster/TabelProduk.tsx

"use client"; // 1. Wajib ditambahkan
import React, { useState, useEffect } from "react"; // 2. Import hook

// 3. Tipe data (HARUS SAMA DENGAN API)
type Product = {
  id: number;
  nama: string;
  kategori: string;
  stok: number;
};

// 4. Fungsi formatter ID
const formatProductId = (id: number) => {
  return `P-${id.toString().padStart(3, '0')}`; // 1 -> P-001
};

export default function TabelProduk() {
  // 5. State untuk data live
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 6. Fungsi fetch data
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/products'); // PANGGIL API
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      alert("Gagal mengambil data produk.");
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Ambil data saat dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daftar Semua Produk</h3>
        <button 
          onClick={fetchProducts} 
          disabled={isLoading}
          className="text-blue-600 text-sm disabled:opacity-50"
        >
          {isLoading ? "Memuat..." : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">ID Produk</th>
              <th className="py-2">Nama Produk</th>
              <th className="py-2">Kategori</th>
              <th className="py-2">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {/* 8. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">Belum ada data produk.</td></tr>
            ) : (
              // 9. Map data 'products' dari state
              products.map((produk) => (
                <tr key={produk.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{formatProductId(produk.id)}</td>
                  <td className="py-3">{produk.nama}</td>
                  <td className="py-3">{produk.kategori}</td>
                  {/* Logika pewarnaan stok Anda tetap aman */}
                  <td className={`py-3 font-medium ${
                    produk.stok === 0 ? 'text-red-500' : (produk.stok <= 99 ? 'text-yellow-500' : 'text-gray-900 dark:text-white') // (Batas 10 diubah ke 99)
                  }`}>
                    {produk.stok}
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
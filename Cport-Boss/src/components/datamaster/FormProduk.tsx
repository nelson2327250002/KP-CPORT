// Isi BARU untuk: src/components/datamaster/FormProduk.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import useEffect
import { useRouter } from "next/navigation";

// Tipe Kategori
type Kategori = {
  id: number;
  nama: string;
};

// (dummyKategoriList DIHAPUS DARI SINI)

type FormProdukProps = {
  produk?: {
    id: number;
    nama: string;
    kategori: string; 
    harga: number;
  };
};

export default function FormProduk({ produk }: FormProdukProps) {
  const router = useRouter();
  const isEditMode = !!produk; 

  const [nama, setNama] = useState(produk?.nama || "");
  const [kategori, setKategori] = useState(produk?.kategori || "");
  const [harga, setHarga] = useState<number | string>(produk?.harga || "");
  
  // 2. ⬇️ STATE BARU UNTUK DAFTAR KATEGORI ⬇️
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoadingKategori, setIsLoadingKategori] = useState(true);

  // 3. ⬇️ AMBIL DATA KATEGORI LIVE SAAT DIMUAT ⬇️
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        setIsLoadingKategori(true);
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) throw new Error('Gagal memuat kategori');
        const data = await response.json();
        setKategoriList(data);
      } catch (error) {
        console.error("Gagal mengambil daftar kategori:", error);
      } finally {
        setIsLoadingKategori(false);
      }
    };
    fetchKategori();
  }, []); // Hanya dijalankan sekali

  // ... (Fungsi handleSubmit tetap sama persis, tidak perlu diubah) ...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kategori || harga === "") {
      alert("Harap pilih kategori dan isi harga.");
      return;
    }

    const data = { 
      nama, 
      kategori, 
      harga: typeof harga === 'string' ? parseInt(harga) : harga 
    };

    if (isEditMode) {
      try {
        const response = await fetch(`http://localhost:3000/products/${produk!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), 
        });
        if (!response.ok) throw new Error('Gagal mengupdate produk');
        
        const updatedProduct = await response.json();
        alert(`Produk "${updatedProduct.nama}" berhasil diupdate!`);
        router.push("/data-master/produk"); 

      } catch (error) {
        console.error(error);
        if (error instanceof Error) alert(`Terjadi kesalahan: ${error.message}`);
      }
    } else {
      try {
        const response = await fetch('http://localhost:3000/products', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), 
        });
        if (!response.ok) throw new Error('Gagal menyimpan produk');
        
        const newProduct = await response.json();
        alert(`Produk "${newProduct.nama}" berhasil dibuat!`);
        router.push("/data-master/produk"); 

      } catch (error) {
        console.error(error);
        if (error instanceof Error) alert(`Terjadi kesalahan: ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Input Nama Produk */}
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Produk
          </label>
          <input
            type="text"
            id="nama"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Contoh: Produk A (Unggulan)"
          />
        </div>

        {/* 4. ⬇️ DROPDOWN KATEGORI SEKARANG LIVE ⬇️ */}
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
          </label>
          <select
            id="kategori"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
            disabled={isLoadingKategori} // Nonaktifkan saat loading
          >
            <option value="" disabled>
              {isLoadingKategori ? "Memuat kategori..." : "-- Pilih kategori --"}
            </option>
            {/* Map dari data live 'kategoriList' */}
            {kategoriList.map((kat) => (
              <option key={kat.id} value={kat.nama}>
                {kat.nama}
              </option>
            ))}
          </select>
        </div>
        {/* ⬆️ BATAS AKHIR PERUBAHAN ⬆️ */}

        {/* Input Harga */}
        <div>
          <label htmlFor="harga" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Harga Jual (Rp)
          </label>
          <input
            type="number"
            id="harga"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
            min="0"
            placeholder="Contoh: 150000"
          />
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
          >
            {isEditMode ? "Simpan Perubahan" : "Simpan Produk Baru"}
          </button>
        </div>
      </form>
    </div>
  );
}
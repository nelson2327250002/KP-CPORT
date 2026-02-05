// Isi BARU untuk: src/components/stok/FormStokMasuk.tsx

"use client"; 
import React, { useState, useEffect } from "react"; 

// Tipe data Produk (dari API)
type Product = {
  id: number;
  nama: string;
  stok: number;
};

export default function FormStokMasuk() {
  const [produkId, setProdukId] = useState<number | string>("");
  const [jumlah, setJumlah] = useState<number | string>("");
  const [supplier, setSupplier] = useState("");
  const [fotoNota, setFotoNota] = useState<File | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil daftar produk saat dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal memuat daftar produk:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoNota(e.target.files[0]);
    }
  };

  // 1. ⬇️ FUNGSI UPLOAD FILE ⬇️
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file); 

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Gagal meng-upload file');
    }
    const result = await response.json();
    return result.url; 
  };

  // 2. ⬇️ FUNGSI SUBMIT DI-UPDATE (2 LANGKAH) ⬇️
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !produkId || jumlah === "" || !supplier || !fotoNota) {
      alert("Harap lengkapi semua field.");
      return;
    }

    setIsLoading(true);

    try {
      // --- LANGKAH 1: UPLOAD FOTO DULU ---
      const fotoNotaUrl = await uploadFile(fotoNota);
      console.log("File nota di-upload ke:", fotoNotaUrl);

      // --- LANGKAH 2: KIRIM DATA STOK MASUK (termasuk URL foto) ---
      const data = { 
        productId: typeof produkId === 'string' ? parseInt(produkId) : produkId,
        jumlah: typeof jumlah === 'string' ? parseInt(jumlah) : jumlah,
        supplier: supplier,
        fotoNotaUrl: fotoNotaUrl, // <-- KIRIM URL
      };

      const response = await fetch('http://localhost:3000/stock/in', { // Panggil API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Gagal menyimpan stok masuk');
      }

      alert("Stok berhasil ditambahkan!");
      
      // Reset form
      setProdukId("");
      setJumlah("");
      setSupplier("");
      setFotoNota(null);
      (e.target as HTMLFormElement).reset(); 
      
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(`Terjadi kesalahan: ${error.message}`);
      } else {
        alert("Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // ⬆️ BATAS AKHIR PERUBAHAN ⬆️

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Pilihan Produk */}
        <div>
          <label htmlFor="produk" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pilih Produk
          </label>
          <select
            id="produk"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={produkId}
            onChange={(e) => setProdukId(e.target.value)}
            required
          >
            <option value="" disabled>-- Pilih produk --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} (Stok saat ini: {p.stok})
              </option>
            ))}
          </select>
        </div>

        {/* Input Jumlah */}
        <div>
          <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jumlah Masuk
          </label>
          <input
            type="number"
            id="jumlah"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
            min="1"
            placeholder="Contoh: 50"
          />
        </div>

        {/* Nama Supplier */}
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Supplier (Wajib)
          </label>
          <input
            type="text"
            id="supplier"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
            placeholder="Contoh: PT. Sumber Jaya"
          />
        </div>

        {/* Foto Nota Supplier */}
        <div>
          <label htmlFor="fotoNota" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Foto Nota Supplier (Wajib)
          </label>
          <input
            type="file"
            id="fotoNota"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            onChange={(e) => setFotoNota(e.target.files ? e.target.files[0] : null)}
            accept="image/*"
            required
          />
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Simpan Stok Masuk"}
          </button>
        </div>
      </form>
    </div>
  );
}
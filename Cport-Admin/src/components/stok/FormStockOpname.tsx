// Isi BARU untuk: src/components/stok/FormStockOpname.tsx

"use client"; 
import React, { useState, useEffect } from "react"; 

// Tipe data Produk (dari API)
type Product = {
  id: number;
  nama: string;
  stok: number;
};

export default function FormStockOpname() {
  const [produkId, setProdukId] = useState<number | string>("");
  const [jumlahFisik, setJumlahFisik] = useState<number | string>(""); 
  const [catatan, setCatatan] = useState("");
  const [buktiFoto, setBuktiFoto] = useState<File | null>(null);

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
      setBuktiFoto(e.target.files[0]);
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
    if (isLoading || !produkId || jumlahFisik === "" || !catatan || !buktiFoto) {
      alert("Harap lengkapi semua field, termasuk catatan dan bukti foto.");
      return;
    }
    
    setIsLoading(true);

    try {
      // --- LANGKAH 1: UPLOAD FOTO DULU ---
      const fotoBuktiUrl = await uploadFile(buktiFoto);
      console.log("File bukti di-upload ke:", fotoBuktiUrl);
      
      // --- LANGKAH 2: KIRIM DATA STOCK OPNAME ---
      const data = { 
        productId: typeof produkId === 'string' ? parseInt(produkId) : produkId,
        jumlahFisik: typeof jumlahFisik === 'string' ? parseInt(jumlahFisik) : jumlahFisik,
        catatan: catatan,
        fotoBuktiUrl: fotoBuktiUrl, // <-- KIRIM URL
      };

      const response = await fetch('http://localhost:3000/stock/opname', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Gagal menyimpan stok opname');
      }

      alert("Stock opname berhasil dicatat!");
      
      // Reset form
      setProdukId("");
      setJumlahFisik("");
      setCatatan("");
      setBuktiFoto(null);
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
                {p.nama} (Stok di Sistem: {p.stok})
              </option>
            ))}
          </select>
        </div>

        {/* Input Jumlah Fisik (JUMLAH BARU) */}
        <div>
          <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jumlah Fisik (Jumlah Baru)
          </label>
          <input
            type="number"
            id="jumlah"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={jumlahFisik}
            onChange={(e) => setJumlahFisik(e.target.value)}
            required
            min="0"
            placeholder="Contoh: 98 (jika ada 2 yang rusak)"
          />
        </div>

        {/* Catatan (Penting untuk audit) */}
        <div>
          <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Catatan Penyesuaian
          </label>
          <textarea
            id="catatan"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: 2 pcs ditemukan rusak/expired."
            required
          />
        </div>

        {/* Bukti Foto */}
        <div>
          <label htmlFor="buktiFoto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bukti Foto (Wajib)
          </label>
          <input
            type="file"
            id="buktiFoto"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            onChange={(e) => setBuktiFoto(e.target.files ? e.target.files[0] : null)}
            accept="image/*"
            required
          />
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Simpan Penyesuaian Stok"}
          </button>
        </div>
      </form>
    </div>
  );
}
// Isi BARU untuk: src/components/keuangan/FormUploadTagihan.tsx

"use client"; 

import React, { useState, useEffect } from "react"; 

// Tipe data Sales (dari API Users)
type SalesUser = {
  id: string;
  nama: string;
  role: string;
};

export default function FormUploadTagihan() {
  const [salesId, setSalesId] = useState("");
  const [jumlah, setJumlah] = useState<number | string>("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalNota, setTanggalNota] = useState("");
  const [fotoNota, setFotoNota] = useState<File | null>(null);

  const [salesList, setSalesList] = useState<SalesUser[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State loading untuk submit

  // Ambil daftar sales saat dimuat
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setSalesList(data.filter((user: any) => user.role === 'Sales'));
      } catch (error) {
        console.error("Gagal memuat daftar sales", error);
        alert("Gagal memuat daftar sales. Pastikan API Users berjalan.");
      }
    };
    fetchSales();
  }, []); 

  // 1. ⬇️ FUNGSI UPLOAD FILE (Sama seperti Beban Manual) ⬇️
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
    if (isLoading || !salesId || jumlah === "" || !deskripsi || !tanggalNota || !fotoNota) {
      alert("Harap lengkapi semua field, termasuk foto nota.");
      return;
    }
    
    const selectedSales = salesList.find(s => s.id === salesId);
    if (!selectedSales) {
      alert("Sales tidak valid.");
      return;
    }

    setIsLoading(true);

    try {
      // --- LANGKAH 1: UPLOAD FOTO DULU ---
      const fotoNotaUrl = await uploadFile(fotoNota);

      // --- LANGKAH 2: KIRIM DATA TAGIHAN (termasuk URL foto) ---
      const data = { 
        salesId, 
        salesName: selectedSales.nama,
        jumlah: typeof jumlah === 'string' ? parseInt(jumlah) : jumlah,
        deskripsi, 
        tanggalNota,
        fotoNotaUrl: fotoNotaUrl, // <-- KIRIM URL
      };

      const response = await fetch('http://localhost:3000/sales-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Gagal mengupload tagihan');

      alert(`Tagihan untuk ${selectedSales.nama} berhasil diupload.`);
      
      // Reset form
      setSalesId("");
      setJumlah("");
      setDeskripsi("");
      setTanggalNota("");
      setFotoNota(null);
      (e.target as HTMLFormElement).reset();
      
      // Nanti kita akan refresh tabel riwayat di bawahnya (jika 'onSuccess' prop ada)

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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Pilihan Sales */}
        <div>
          <label htmlFor="sales" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pilih Sales
          </label>
          <select
            id="sales"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={salesId}
            onChange={(e) => setSalesId(e.target.value)}
            required
          >
            <option value="" disabled>-- Pilih sales --</option>
            {salesList.map((s) => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
        </div>

        {/* Tanggal Nota */}
        <div>
          <label htmlFor="tanggalNota" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tanggal Tagihan
          </label>
          <input
            type="date"
            id="tanggalNota"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={tanggalNota}
            onChange={(e) => setTanggalNota(e.target.value)}
            required
          />
        </div>

        {/* Jumlah Tagihan */}
        <div>
          <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jumlah Tagihan (Rp)
          </label>
          <input
            type="number"
            id="jumlah"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value))}
            required
            min="1"
            placeholder="Contoh: 500000"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deskripsi Tagihan
          </label>
          <textarea
            id="deskripsi"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Contoh: Biaya sampel Produk A 5 pcs"
            required
          />
        </div>

        {/* Foto Nota */}
        <div>
          <label htmlFor="fotoNota" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Foto Nota (Wajib)
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading ? "Mengupload..." : "Upload Tagihan"}
          </button>
        </div>
      </form>
    </div>
  );
}
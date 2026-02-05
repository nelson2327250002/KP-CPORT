// Isi BARU untuk: src/components/keuangan/FormBebanManual.tsx

"use client"; 

import React, { useState } from "react";

export default function FormBebanManual() {
  const [tanggal, setTanggal] = useState("");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState<number | string>("");
  const [catatan, setCatatan] = useState("");
  const [fotoNota, setFotoNota] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. ⬇️ FUNGSI BARU UNTUK UPLOAD FILE ⬇️
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file); // 'file' harus cocok dengan di controller

    // Panggil API Upload
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
      // JANGAN set 'Content-Type', biarkan browser menentukannya
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal meng-upload file');
    }
    
    const result = await response.json();
    // Kembalikan URL file (misal: /uploads/namafile.jpg)
    return result.url; 
  };

  // 2. ⬇️ FUNGSI SUBMIT DI-UPDATE (2 LANGKAH) ⬇️
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !tanggal || !kategori || jumlah === "" || !catatan || !fotoNota) {
      alert("Harap lengkapi semua field, termasuk foto nota.");
      return;
    }

    setIsLoading(true);

    try {
      // --- LANGKAH 1: UPLOAD FOTO DULU ---
      const attachmentUrl = await uploadFile(fotoNota);
      console.log("File di-upload ke:", attachmentUrl);

      // --- LANGKAH 2: KIRIM DATA JURNAL (termasuk URL foto) ---
      const refId = `BEBAN-${Date.now()}`;
      const data = { 
        deskripsi: catatan,
        akunBeban: kategori,
        akunKas: "Kas", 
        jumlah: typeof jumlah === 'string' ? parseInt(jumlah) : jumlah,
        refId: refId,
        attachmentUrl: attachmentUrl, // <-- KIRIM URL
      };

      const response = await fetch('http://localhost:3000/jurnal/beban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Gagal menyimpan beban');
      }

      alert("Beban manual berhasil dicatat di jurnal.");
      
      // Reset form
      setTanggal("");
      setKategori("");
      setJumlah("");
      setCatatan("");
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
        
        {/* Input Tanggal */}
        <div>
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tanggal Pengeluaran
          </label>
          <input
            type="date"
            id="tanggal"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        {/* Pilihan Kategori Beban */}
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori Beban
          </label>
          <select
            id="kategori"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
          >
            <option value="" disabled>-- Pilih kategori --</option>
            <option value="Beban Transportasi">Transportasi (Bensin, Tol)</option>
            <option value="Beban Konsumsi">Konsumsi (Makan, Minum)</option>
            <option value="Beban ATK">Alat Tulis Kantor (ATK)</option>
            <option value="Beban Operasional">Operasional (Listrik, Air)</option>
            <option value="Beban Lainnya">Beban Lainnya</option>
          </select>
        </div>

        {/* Input Jumlah */}
        <div>
          <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jumlah Pengeluaran (Rp)
          </label>
          <input
            type="number"
            id="jumlah"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value))}
            required
            min="1"
            placeholder="Contoh: 150000"
          />
        </div>

        {/* Catatan/Deskripsi */}
        <div>
          <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Catatan / Deskripsi
          </label>
          <textarea
            id="catatan"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Bensin mobil operasional 10 Nov"
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
            {isLoading ? "Memproses..." : "Simpan Beban"}
          </button>
        </div>
      </form>
    </div>
  );
}
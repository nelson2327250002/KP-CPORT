// Isi BARU untuk: src/components/supervisi/FormKoreksiTagihan.tsx

"use client"; 

import React, { useState, useEffect } from "react"; // 1. Import useEffect
import { useRouter } from "next/navigation";

// Tipe data Sales (Nanti kita fetch dari /users)
type SalesUser = {
  id: string;
  nama: string;
};

// 2. Tipe data Tagihan (dari props)
type Tagihan = {
  id: number;
  salesId: string;
  salesName: string;
  tanggalNota: string;
  jumlah: number;
  deskripsi: string;
  status: 'BELUM LUNAS' | 'LUNAS';
};

type FormTagihanProps = {
  tagihan: Tagihan;
};

export default function FormKoreksiTagihan({ tagihan }: FormTagihanProps) {
  const router = useRouter();

  // 3. State diisi dengan data dari 'props'
  const [salesId, setSalesId] = useState(tagihan.salesId);
  const [jumlah, setJumlah] = useState<number | string>(tagihan.jumlah);
  const [deskripsi, setDeskripsi] = useState(tagihan.deskripsi);
  // Format tanggal YYYY-MM-DD untuk input 'date'
  const [tanggalNota, setTanggalNota] = useState(tagihan.tanggalNota.split('T')[0]); 
  const [status, setStatus] = useState(tagihan.status);
  const [fotoNota, setFotoNota] = useState<File | null>(null);

  // 4. State untuk daftar sales
  const [salesList, setSalesList] = useState<SalesUser[]>([]);

  // 5. Ambil daftar sales saat dimuat
  useEffect(() => {
    const fetchSales = async () => {
      // (Ini asumsi API /users Anda mengembalikan sales,
      // nanti kita bisa buat endpoint khusus /users/sales)
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        // Filter hanya yang rolenya 'Sales'
        setSalesList(data.filter((user: any) => user.role === 'Sales'));
      } catch (error) {
        console.error("Gagal memuat daftar sales", error);
      }
    };
    fetchSales();
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoNota(e.target.files[0]);
    }
  };

  // 6. Hubungkan handleSubmit ke API PATCH
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cari 'salesName' berdasarkan 'salesId' yang dipilih
    const selectedSales = salesList.find(s => s.id === salesId);
    if (!selectedSales) {
      alert("Sales tidak valid.");
      return;
    }

    // Nanti kita atur upload file fotoNota
    // Untuk sekarang, kita hanya update data teks
    
    const dataToUpdate = { 
      salesId, 
      salesName: selectedSales.nama,
      jumlah: typeof jumlah === 'string' ? parseInt(jumlah) : jumlah,
      deskripsi, 
      tanggalNota,
      status,
      // fotoNotaUrl: (jika foto baru diupload)
    };

    try {
      const response = await fetch(`http://localhost:3000/sales-invoices/${tagihan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) throw new Error('Gagal mengoreksi tagihan');

      const updatedInvoice = await response.json();
      alert(`Tagihan ID ${updatedInvoice.id} berhasil dikoreksi.`);
      router.push("/supervisi/koreksi-tagihan"); // Arahkan kembali

    } catch (error) {
      console.error(error);
      alert("Gagal mengoreksi tagihan.");
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
            Tanggal Nota
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
            required
          />
        </div>

        {/* Pilihan Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status Pembayaran
          </label>
          <select
            id="status"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'BELUM LUNAS' | 'LUNAS')}
            required
          >
            <option value="BELUM LUNAS">BELUM LUNAS</option>
            <option value="LUNAS">LUNAS</option>
          </select>
        </div>

        {/* Foto Nota */}
        <div>
          <label htmlFor="fotoNota" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Foto Nota Baru (Opsional)
          </label>
          <input
            type="file"
            id="fotoNota"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            onChange={handleFotoChange}
            accept="image/*"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Kosongkan jika tidak ingin mengganti foto nota lama.
          </p>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 cursor-pointer font-medium"
          >
            Simpan Koreksi
          </button>
        </div>
      </form>
    </div>
  );
}
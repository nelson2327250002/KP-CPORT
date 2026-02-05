// Isi BARU untuk: src/components/keuangan/TabelJurnal.tsx

"use client"; 
import React, { useState, useEffect } from "react"; 
import Link from "next/link"; // 1. Import Link

// 2. Tipe data (HARUS SAMA DENGAN API)
type JurnalEntry = {
  id: number;
  tanggal: string;
  deskripsi: string;
  akun: string;
  debit: number;
  kredit: number;
  refId: string | null;
  attachmentUrl: string | null; // <-- TAMBAHKAN INI
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  if (angka === 0) return "-";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function TabelJurnal() {
  const [entries, setEntries] = useState<JurnalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fungsi fetch data
  const fetchJurnal = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/jurnal'); // PANGGIL API
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Gagal mengambil data jurnal:", error);
      alert("Gagal mengambil data jurnal.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Ambil data saat dimuat
  useEffect(() => {
    fetchJurnal();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Jurnal Umum (Semua Transaksi)</h3>
        <button 
          onClick={fetchJurnal} 
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
              <th className="py-2">Tanggal</th>
              <th className="py-2">Akun</th>
              <th className="py-2">Deskripsi</th>
              <th className="py-2">Lampiran</th> {/* 5. KOLOM BARU */}
              <th className="py-2">Debit</th>
              <th className="py-2">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">Belum ada data jurnal.</td></tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-700">
                  <td className="py-3 text-sm">
                    {new Date(entry.tanggal).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 font-medium">{entry.akun}</td>
                  <td className="py-3">{entry.deskripsi}</td>
                  
                  {/* 6. ⬇️ TAMPILKAN LINK FOTO ⬇️ */}
                  <td className="py-3">
                    {entry.attachmentUrl ? (
                      // Link ini mengarah ke "mesin" API Anda
                      <Link 
                        href={`http://localhost:3000${entry.attachmentUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Lihat Foto
                      </Link>
                    ) : (
                      "-" // Tampilkan strip jika tidak ada lampiran
                    )}
                  </td>
                  {/* ⬆️ --------------------- ⬆️ */}

                  <td className="py-3">{formatRupiah(entry.debit)}</td>
                  <td className="py-3">{formatRupiah(entry.kredit)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
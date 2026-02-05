// Isi BARU untuk: src/components/kontrol/TabelLogAudit.tsx

"use client"; // 1. Wajib ditambahkan
import React, { useState, useEffect } from "react"; // 2. Import hook

// Tipe data Log (HARUS SAMA DENGAN DI API)
type Log = {
  id: string;
  waktu: string; // (Akan jadi string setelah JSON)
  pengguna: string;
  aksi: string;
  dataSebelum: string | null;
  dataSesudah: string | null;
};

export default function TabelLogAudit() {
  // 3. State untuk menyimpan data live dan status loading
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fungsi untuk mengambil data dari "mesin"
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // PANGGIL API BARU ANDA
      const response = await fetch('http://localhost:3000/log-audit'); 
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Gagal mengambil data log:", error);
      alert("Gagal mengambil data log audit.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Jejak Aktivitas Sistem (Immutable)</h3>
        {/* Tombol refresh manual (opsional, tapi bagus) */}
        <button 
          onClick={fetchLogs} 
          disabled={isLoading}
          className="text-blue-600 text-sm disabled:opacity-50"
        >
          {isLoading ? "Memuat..." : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            {/* ... (Header tabel tetap sama) ... */}
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Waktu</th>
              <th className="py-2">Pengguna (Siapa)</th>
              <th className="py-2">Aksi (Apa)</th>
              <th className="py-2">Data Sebelum</th>
              <th className="py-2">Data Sesudah</th>
            </tr>
          </thead>
          <tbody>
            {/* 6. Tampilkan status Loading atau Data */}
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  Mengambil data log dari server...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  Belum ada aktivitas log.
                </td>
              </tr>
            ) : (
              // 7. Map data 'logs' dari state (bukan dummy lagi)
              logs.map((log) => (
                <tr key={log.id} className="border-b dark:border-gray-700">
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {/* Format waktu agar lebih rapi */}
                    {new Date(log.waktu).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 font-medium">{log.pengguna}</td>
                  <td className="py-3">{log.aksi}</td>
                  <td className="py-3">
                    <code className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 p-1 rounded whitespace-pre-wrap">
                      {log.dataSebelum}
                    </code>
                  </td>
                  <td className="py-3">
                    <code className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 p-1 rounded whitespace-pre-wrap">
                      {log.dataSesudah}
                    </code>
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
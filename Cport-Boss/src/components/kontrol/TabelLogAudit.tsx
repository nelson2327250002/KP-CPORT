// Isi untuk: src/components/kontrol/TabelLogAudit.tsx

import React from "react";

// Data dummy untuk Log Audit (CCTV Digital)
const dummyLogData = [
  {
    id: "L-001",
    waktu: "12 Nov 2025, 01:15:03",
    pengguna: "Admin Operasional (Admin)",
    aksi: "Memproses Pesanan #F-1025",
    sebelum: "Status: Menunggu Diproses",
    sesudah: "Status: Sedang Dikirim",
  },
  {
    id: "L-002",
    waktu: "12 Nov 2025, 01:10:22",
    pengguna: "Boss (Anda)",
    aksi: "Menghapus Pengguna 'Citra Lestari'",
    sebelum: "Pengguna 'Citra Lestari' ada",
    sesudah: "Pengguna dihapus",
  },
  {
    id: "L-003",
    waktu: "12 Nov 2025, 01:09:00",
    pengguna: "Boss (Anda)",
    aksi: "Mengubah Role 'Budi Santoso'",
    sebelum: "Role: Sales",
    sesudah: "Role: Admin",
  },
  {
    id: "L-004",
    waktu: "12 Nov 2025, 01:05:15",
    pengguna: "Boss (Anda)",
    aksi: "Membuat Pengguna Baru 'Citra Lestari'",
    sebelum: "N/A",
    sesudah: "Pengguna 'Citra Lestari' (Sales) dibuat",
  },
];

export default function TabelLogAudit() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Jejak Aktivitas Sistem (Immutable)</h3>
        {/* Tidak ada tombol Tambah/Hapus/Edit */}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Waktu</th>
              <th className="py-2">Pengguna (Siapa)</th>
              <th className="py-2">Aksi (Apa)</th>
              <th className="py-2">Data Sebelum</th>
              <th className="py-2">Data Sesudah</th>
            </tr>
          </thead>
          <tbody>
            {dummyLogData.map((log) => (
              <tr key={log.id} className="border-b dark:border-gray-700">
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{log.waktu}</td>
                <td className="py-3 font-medium">{log.pengguna}</td>
                <td className="py-3">{log.aksi}</td>
                {/* Data Sebelum (Warna Merah) */}
                <td className="py-3">
                  <code className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 p-1 rounded">
                    {log.sebelum}
                  </code>
                </td>
                {/* Data Sesudah (Warna Hijau) */}
                <td className="py-3">
                  <code className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 p-1 rounded">
                    {log.sesudah}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
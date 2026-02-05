// Isi BARU untuk: src/components/dashboard/RiwayatPengumuman.tsx

"use client";
import React from "react";

// 1. Tipe data (HARUS SAMA DENGAN API)
type Announcement = {
  id: number;
  tanggal: string;
  pembuat: string;
  pesan: string;
};

// 2. Tipe prop baru
type RiwayatProps = {
  announcements: Announcement[];
  isLoading: boolean;
  onHapus: (id: number, pesan: string) => void; // Fungsi hapus dari induk
};

export default function RiwayatPengumuman({ 
  announcements, 
  isLoading, 
  onHapus 
}: RiwayatProps) {
  
  // (Fungsi handleEdit & handleDelete dipindah ke halaman induk)

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Riwayat Pengumuman Terkirim</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Tanggal</th>
              <th className="py-2">Pembuat</th>
              <th className="py-2">Pesan</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* 3. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : announcements.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">Belum ada pengumuman.</td></tr>
            ) : (
              // 4. Map data dari 'props'
              announcements.map((item) => (
                <tr key={item.id} className="border-b dark:border-gray-700">
                  <td className="py-3 text-sm">
                    {new Date(item.tanggal).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3">{item.pembuat}</td>
                  <td className="py-3">{item.pesan}</td>
                  <td className="py-3 flex gap-2">
                    <button
                      // onClick={() => handleEdit(item.id)} // (Edit bisa ditambahkan nanti)
                      className="text-yellow-500 hover:text-yellow-700 opacity-50 cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onHapus(item.id, item.pesan)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
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
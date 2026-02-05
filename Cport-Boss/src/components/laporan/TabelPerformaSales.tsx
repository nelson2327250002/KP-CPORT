// Isi BARU untuk: src/components/laporan/TabelPerformaSales.tsx

import React from 'react';

// 1. ⬇️ Tipe data (HARUS SAMA DENGAN API) ⬇️
type SalesPerformance = {
  id: number;
  nama: string;
  tercapai: number;
  target: number;
  persentase: string;
};

// 2. ⬇️ Tentukan tipe 'Props' yang diterima ⬇️
type Props = {
  data: SalesPerformance[];
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

// 3. ⬇️ Terima 'data' sebagai prop ⬇️
export default function TabelPerformaSales({ data }: Props) {
  // (Data dummy 'dummyPerforma' DIHAPUS DARI SINI)

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Analisis Performa Sales (vs. Target)</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Nama Sales</th>
              <th className="py-2">Pencapaian</th>
              <th className="py-2">Target</th>
              <th className="py-2" style={{width: "30%"}}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. ⬇️ Map 'data' dari props ⬇️ */}
            {data.map((sales) => {
              const persentase = parseFloat(sales.persentase); // Ubah string ke angka
              const isOverTarget = persentase > 100;

              return (
                <tr key={sales.id} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium">{sales.nama}</td>
                  <td className="py-3">{formatRupiah(sales.tercapai)}</td>
                  <td className="py-3">{formatRupiah(sales.target)}</td>
                  <td className="py-3">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className={`${isOverTarget ? 'bg-green-500' : 'bg-blue-600'} h-2 rounded-full`}
                          style={{ width: `${isOverTarget ? 100 : persentase}%` }}
                        ></div>
                      </div>
                      <span className={`font-medium ${isOverTarget ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                        {sales.persentase}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
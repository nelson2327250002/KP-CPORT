// Isi untuk: src/components/laporan/TabelLoyalitasToko.tsx

import React from 'react';

type StorePerformance = {
  namaToko: string;
  totalOmset: number;
};

type Props = {
  data: StorePerformance[];
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function TabelLoyalitasToko({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Analisis Loyalitas Toko (Top 5 Omset)</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Nama Toko</th>
              <th className="py-2">Total Omset</th>
            </tr>
          </thead>
          <tbody>
            {data.map((toko) => (
              <tr key={toko.namaToko} className="border-b dark:border-gray-700">
                <td className="py-3 font-medium">{toko.namaToko}</td>
                <td className="py-3">{formatRupiah(toko.totalOmset)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
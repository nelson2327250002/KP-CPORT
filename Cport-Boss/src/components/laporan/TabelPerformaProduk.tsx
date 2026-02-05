// Isi untuk: src/components/laporan/TabelPerformaProduk.tsx

import React from 'react';

type ProductPerformance = {
  id: number;
  nama: string;
  stok: number;
  totalTerjual: number;
};

type Props = {
  data: ProductPerformance[];
};

export default function TabelPerformaProduk({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Analisis Performa Produk (Top 5 Terlaris)</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Nama Produk</th>
              <th className="py-2">Total Terjual (Unit)</th>
              <th className="py-2">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {data.map((produk) => (
              <tr key={produk.id} className="border-b dark:border-gray-700">
                <td className="py-3 font-medium">{produk.nama}</td>
                <td className="py-3">{produk.totalTerjual}</td>
                <td className="py-3">{produk.stok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
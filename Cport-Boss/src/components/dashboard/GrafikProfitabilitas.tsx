// Isi BARU untuk: src/components/dashboard/GrafikProfitabilitas.tsx

"use client"; // 1. Wajib jadi Client Component untuk grafik

import React, { useState, useEffect } from 'react';
// 2. Import komponen-komponen dari 'recharts'
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Area, 
  Bar 
} from 'recharts';

// Tipe data (HARUS SAMA DENGAN API)
type ProfitData = {
  name: string; // Misal: "Nov"
  Omset: number;
  Beban: number;
  Profit: number;
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  if (angka >= 1000000) {
    return `Rp ${(angka / 1000000).toFixed(0)} Jt`; // Rp 1 Jt
  }
  if (angka >= 1000) {
    return `Rp ${(angka / 1000).toFixed(0)} Rb`; // Rp 1 Rb
  }
  return `Rp ${angka}`;
};


export default function GrafikProfitabilitas() {
  // 3. State untuk data live
  const [data, setData] = useState<ProfitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Ambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/reports/profitability');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data profit:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-10">Memuat data grafik...</div>;
  }

  // 5. Tampilkan Grafik
  return (
<div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis 
            tickFormatter={formatRupiah} // Format angka di sumbu Y
            stroke="#6b7280" 
          />
          <Tooltip 
            formatter={(value: number) => formatRupiah(value)} // Format angka di tooltip
          />
          <Legend />
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" />
          
          {/* Beban (Batang Merah) */}
          <Bar dataKey="Beban" fill="#ef4444" barSize={20} />
          {/* Omset (Batang Biru) */}
          <Bar dataKey="Omset" fill="#3b82f6" barSize={20} />
          {/* Profit (Area Hijau) */}
          <Area type="monotone" dataKey="Profit" fill="#10b981" stroke="#10b981" fillOpacity={0.3} />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
// Isi BARU untuk: src/components/dashboard/WidgetRingkasanTarget.tsx

"use client"; // Wajib jadi Client Component
import React, { useState, useEffect } from 'react';

// Tipe data (HARUS SAMA DENGAN API)
type SalesPerformance = {
  id: number;
  nama: string;
  tercapai: number;
  target: number;
  persentase: string;
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function WidgetRingkasanTarget() {
  const [data, setData] = useState({ tercapai: 0, target: 0, persentase: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dari API Laporan Analitik
  useEffect(() => {
    const fetchRingkasanTarget = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/reports/analytics');
        const result = await response.json();
        
        // Ambil data performa sales
        const salesData: SalesPerformance[] = result.salesPerformance || [];

        // Hitung total dari semua sales
        let totalTercapai = 0;
        let totalTarget = 0;
        
        salesData.forEach(sales => {
          totalTercapai += sales.tercapai;
          totalTarget += sales.target;
        });

        const persentase = totalTarget === 0 ? 0 : (totalTercapai / totalTarget) * 100;

        setData({
          tercapai: totalTercapai,
          target: totalTarget,
          persentase: persentase,
        });

      } catch (error) {
        console.error("Gagal mengambil ringkasan target:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRingkasanTarget();
  }, []); // Hanya dijalankan sekali

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Pencapaian Tim Bulan Ini
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {isLoading ? "..." : data.persentase.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${data.persentase}%` }}
        ></div>
      </div>

      {/* Angka Detail */}
      <div className="text-center">
        {isLoading ? (
          <p className="text-xl font-bold">Memuat...</p>
        ) : (
          <>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatRupiah(data.tercapai)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              dari Target: {formatRupiah(data.target)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
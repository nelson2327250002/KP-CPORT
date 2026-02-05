// Isi BARU untuk: src/app/(admin)/laporan/analitik/page.tsx

"use client"; 

import type { Metadata } from "next";
import React, { useState, useEffect } from "react"; 

// Import SEMUA komponen laporan
import TabelPerformaSales from "@/components/laporan/TabelPerformaSales";
import TabelPerformaProduk from "@/components/laporan/TabelPerformaProduk";
import TabelLoyalitasToko from "@/components/laporan/TabelLoyalitasToko";

// Tipe data (HARUS SAMA DENGAN API)
type SalesPerformance = {
  id: number;
  nama: string;
  tercapai: number;
  target: number;
  persentase: string;
};
type ProductPerformance = {
  id: number;
  nama: string;
  stok: number;
  totalTerjual: number;
};
type StorePerformance = {
  namaToko: string;
  totalOmset: number;
};

// Tipe data untuk seluruh laporan
type AnalyticsData = {
  salesPerformance: SalesPerformance[];
  productPerformance: ProductPerformance[];
  storePerformance: StorePerformance[];
};

export default function LaporanAnalitikPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi fetch data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/reports/analytics');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data analitik:", error);
        alert("Gagal mengambil data analitik.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []); 

  // Tampilkan status Loading
  if (isLoading || !data) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-3xl font-bold">Laporan & Analitik Bisnis</h1>
        <p className="mt-4">Memuat data laporan...</p>
      </div>
    );
  }

  // Tampilkan data live
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Laporan & Analitik Bisnis</h1>

      {/* ⬇️ PERBAIKAN: Gunakan 'optional chaining' (?.) dan 'fallback' ([]) ⬇️ */}
      
      {/* Komponen 1: Performa Sales */}
      <TabelPerformaSales data={data?.salesPerformance || []} />

      {/* Komponen 2: Performa Produk */}
      <TabelPerformaProduk data={data?.productPerformance || []} />

      {/* Komponen 3: Loyalitas Pelanggan */}
      <TabelLoyalitasToko data={data?.storePerformance || []} />
      
      {/* ⬆️ -------------------------------------------------------- ⬆️ */}
    </div>
  );
}
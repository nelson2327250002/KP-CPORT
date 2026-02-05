"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import router untuk redirect
import dynamic from "next/dynamic";

import WidgetRingkasanTarget from "@/components/dashboard/WidgetRingkasanTarget";
import WidgetNotifikasiPenting from "@/components/dashboard/WidgetNotifikasiPenting";
import PanelPengumuman from "@/components/dashboard/PanelPengumuman";
import GrafikProfitabilitas from "@/components/dashboard/GrafikProfitabilitas";

const PetaLokasiSales = dynamic(
  () => import("@/components/dashboard/PetaLokasiSales"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[400px] flex justify-center items-center">
        Memuat Peta...
      </div>
    ),
  }
);

export default function DashboardEksekutifPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. CEK SESI SAAT HALAMAN DIBUKA
    const userData = sessionStorage.getItem("cport-user");

    if (!userData) {
      // Jika data kosong, langsung lempar ke login
      router.replace("/login"); 
    } else {
      // Jika ada data, izinkan tampilkan dashboard
      setIsChecking(false);
    }
  }, [router]);

  // 2. JANGAN TAMPILKAN APA-APA SELAMA PENGECEKAN (Mencegah kedipan dashboard)
  if (isChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* === KOLOM KIRI === */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        
        {/* CARD: Grafik Profitabilitas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Grafik Profitabilitas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ringkasan performa bulanan
            </p>
          </div>
          <div className="p-6 h-[300px] relative">
            <GrafikProfitabilitas />
          </div>
        </div>

        {/* CARD: Peta Lokasi Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Peta Lokasi Sales
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posisi sales terkini secara real-time
            </p>
          </div>
          <div className="p-3 h-[420px] relative">
            <PetaLokasiSales />
          </div>
        </div>
      </div>

      {/* === KOLOM KANAN === */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Ringkasan Target Tim</h2>
          <WidgetRingkasanTarget />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">🔔 Peringatan Dini</h2>
          <WidgetNotifikasiPenting />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">📣 Buat Pengumuman Cepat</h2>
          <PanelPengumuman pembuat="Boss" />
        </div>
      </div>
    </div>
  );
}
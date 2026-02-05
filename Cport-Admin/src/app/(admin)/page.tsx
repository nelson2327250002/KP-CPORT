// Ini adalah isi LENGKAP untuk file: src/app/(admin)/page.tsx

import type { Metadata } from "next";
import React from "react";

// ⬇️ LANGKAH 1: IMPORT KOMPONEN TERAKHIR KITA ⬇️
import PanelPengumuman from "@/components/dashboard/PanelPengumuman";
import WidgetStokRendah from "@/components/dashboard/WidgetStokRendah";
import WidgetPesananBaru from "@/components/dashboard/WidgetPesananBaru"; // <-- IMPORT INI

export const metadata: Metadata = {
  title: "Dashboard Admin | Cport",
  description: "Pusat Kontrol Operasional Admin Cport",
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      {/* === KOLOM UTAMA (KIRI) === */}
      <div className="col-span-12 xl:col-span-7">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🔔 Pesanan Baru (Real-time)
        </h2>

        {/* ⬇️ LANGKAH 2: GANTI DIV DENGAN KOMPONEN INI ⬇️ */}
        <WidgetPesananBaru />
        
      </div>

      {/* === KOLOM SAMPING (KANAN) === */}
      <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
        
        {/* 1. Widget Stok Rendah */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            ⚠️ Peringatan Stok Rendah
          </h2>
          
          <WidgetStokRendah />
          
        </div>

        {/* 2. Panel Pengumuman Cepat */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📣 Buat Pengumuman Cepat
          </h2>
          
          <PanelPengumuman />
          
        </div>
      </div>

    </div>
  );
}
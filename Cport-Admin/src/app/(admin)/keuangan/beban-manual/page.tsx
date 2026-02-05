// Isi untuk: src/app/(admin)/keuangan/beban-manual/page.tsx

import type { Metadata } from "next";
import React from "react";

// 1. Kita impor komponen formulir yang baru kita buat
import FormBebanManual from "@/components/keuangan/FormBebanManual";

export const metadata: Metadata = {
  title: "Input Beban (Manual) | Cport",
  description: "Formulir untuk mencatat beban operasional manual",
};

export default function BebanManualPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Input Beban (Manual)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gunakan formulir ini untuk mencatat pengeluaran operasional (bensin, tol, listrik, ATK, dll).
      </p>

      {/* Komponen Formulir kita */}
      <FormBebanManual />
      
    </div>
  );
}
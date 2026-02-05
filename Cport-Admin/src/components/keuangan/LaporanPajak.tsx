// Isi BARU untuk: src/components/keuangan/LaporanPajak.tsx

"use client"; 
import React, { useState, useEffect } from "react"; // 1. Import hook

// 2. Tipe data Order (HARUS SAMA DENGAN API)
type Order = {
  id: number;
  fakturId: string | null;
  totalKeseluruhan: number;
  status: 'Menunggu Diproses' | 'Sedang Dikirim' | 'Terkirim' | 'DIBATALKAN';
  tanggalPesanan: string;
};

// Fungsi format mata uang
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

// Tipe data untuk rekap PPN
type RekapPpn = {
  noFaktur: string;
  tanggal: string;
  dpp: number;
  ppn: number;
};

export default function LaporanPajak() {
  const [bulan, setBulan] = useState("2025-11"); // Nanti filter ini akan kita fungsikan
  
  // 3. State untuk data live
  const [rekapList, setRekapList] = useState<RekapPpn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({ totalDpp: 0, totalPpn: 0 });

  // 4. Fungsi fetch data dan kalkulasi PPN
  const fetchLaporanPajak = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/orders'); // PANGGIL API
      const allOrders: Order[] = await response.json();
      
      let totalDpp = 0;
      let totalPpn = 0;

      // 5. Filter HANYA yang 'Terkirim' dan hitung PPN
      const filteredRekap = allOrders
        .filter(order => order.status === 'Terkirim')
        // Nanti kita filter berdasarkan 'bulan' juga
        .map(order => {
          // Asumsi PPN 11% (Total = DPP + 11% DPP = 111% DPP)
          const dpp = order.totalKeseluruhan / 1.11;
          const ppn = order.totalKeseluruhan - dpp;

          totalDpp += dpp;
          totalPpn += ppn;

          return {
            noFaktur: order.fakturId || `Order #${order.id}`,
            tanggal: new Date(order.tanggalPesanan).toLocaleDateString('id-ID'),
            dpp: dpp,
            ppn: ppn,
          };
        });

      setRekapList(filteredRekap);
      setTotals({ totalDpp, totalPpn });

    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      alert("Gagal mengambil data laporan pajak.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Ambil data saat dimuat
  useEffect(() => {
    fetchLaporanPajak();
  }, [bulan]); // Akan refresh jika 'bulan' diganti

  // 7. Fungsi Ekspor PDF (Placeholder)
  const handleEksporPDF = () => {
    alert(`Logika EKSPOR PDF untuk Laporan PPN Bulan: ${bulan}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Filter Laporan */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b dark:border-gray-700">
        <div className="flex-1">
          <label
            htmlFor="bulan"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Pilih Bulan Laporan
          </label>
          <input
            type="month"
            id="bulan"
            className="w-full md:w-auto p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          />
        </div>
        <div className="flex-1 flex md:justify-end items-end">
          <button
            onClick={handleEksporPDF}
            className="w-full md:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer font-medium"
          >
            Ekspor Laporan PPN ke PDF
          </button>
        </div>
      </div>

      {/* Tabel Rekapitulasi */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">
          Rekapitulasi PPN Keluaran (Bulan: {bulan})
        </h3>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">No. Faktur</th>
              <th className="py-2">Tanggal</th>
              <th className="py-2">DPP (Dasar Pengenaan Pajak)</th>
              <th className="py-2">PPN (11%)</th>
            </tr>
          </thead>
          <tbody>
            {/* 8. Tampilkan Loading atau Data */}
            {isLoading ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">Mengambil data...</td></tr>
            ) : rekapList.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">Belum ada data PPN untuk bulan ini.</td></tr>
            ) : (
              rekapList.map((item) => (
                <tr key={item.noFaktur} className="border-b dark:border-gray-700">
                  <td className="py-3 font-medium text-blue-600">{item.noFaktur}</td>
                  <td className="py-3">{item.tanggal}</td>
                  <td className="py-3">{formatRupiah(item.dpp)}</td>
                  <td className="py-3">{formatRupiah(item.ppn)}</td>
                </tr>
              ))
            )}
          </tbody>
          {/* Total Laporan */}
          <tfoot className="bg-gray-50 dark:bg-gray-700">
            <tr className="font-bold border-t-2 dark:border-gray-600">
              <td className="py-4" colSpan={2}>TOTAL</td>
              <td className="py-4">{formatRupiah(totals.totalDpp)}</td>
              <td className="py-4">{formatRupiah(totals.totalPpn)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
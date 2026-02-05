// Isi BARU untuk: src/components/target/FormManajemenTarget.tsx

"use client"; 
import React, { useState, useEffect, useCallback } from "react"; // 1. Import hook

// Tipe data (HARUS SAMA DENGAN API)
type SalesUser = {
  id: number;
  nama: string;
};

type SalesTarget = {
  id: number;
  salesId: number;
  salesName: string;
  bulan: string;
  targetAmount: number;
};

// Tipe untuk state target (menggunakan salesId sebagai key)
type TargetsState = Record<number, number | string>;

export default function FormManajemenTarget() {
  const [bulan, setBulan] = useState("2025-11"); // Default ke November 2025
  const [salesList, setSalesList] = useState<SalesUser[]>([]);
  const [targets, setTargets] = useState<TargetsState>({});
  const [isLoading, setIsLoading] = useState(true);

  // 2. ⬇️ FUNGSI UNTUK MENGAMBIL DAFTAR SALES ⬇️
  const fetchSalesList = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/sales-targets/sales-list');
      const data = await response.json();
      setSalesList(data);
    } catch (error) {
      console.error("Gagal memuat daftar sales:", error);
      alert("Gagal memuat daftar sales.");
    }
  }, []);

  // 3. ⬇️ FUNGSI UNTUK MENGAMBIL TARGET YANG SUDAH ADA ⬇️
  const fetchTargets = useCallback(async (selectedMonth: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/sales-targets?bulan=${selectedMonth}`);
      const data: SalesTarget[] = await response.json();
      
      // Ubah array data menjadi objek state
      const targetsData: TargetsState = {};
      data.forEach(target => {
        targetsData[target.salesId] = target.targetAmount;
      });
      setTargets(targetsData);
      
    } catch (error) {
      console.error("Gagal memuat data target:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Ambil data saat halaman dimuat
  useEffect(() => {
    fetchSalesList();
    fetchTargets(bulan);
  }, [fetchSalesList, fetchTargets, bulan]); // 'bulan' ditambahkan agar otomatis refresh

  // Fungsi untuk update state saat Boss mengetik target
  const handleTargetChange = (salesId: number, value: string) => {
    setTargets(prevTargets => ({
      ...prevTargets,
      [salesId]: value === "" ? "" : parseInt(value),
    }));
  };

  // 5. ⬇️ FUNGSI SUBMIT KE API ⬇️
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ubah state (objek) kembali menjadi array untuk dikirim ke API
    const dataToSend: any[] = [];
    for (const sales of salesList) {
      const targetAmount = targets[sales.id];
      if (targetAmount === "" || targetAmount === undefined) {
        alert(`Harap isi target untuk ${sales.nama}.`);
        return;
      }
      
      dataToSend.push({
        salesId: sales.id,
        salesName: sales.nama,
        bulan: bulan,
        targetAmount: typeof targetAmount === 'string' ? parseInt(targetAmount) : targetAmount,
      });
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/sales-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error('Gagal menyimpan target');
      
      alert(`Target untuk bulan ${bulan} berhasil disimpan!`);
      
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan target.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Filter Bulan */}
        <div className="mb-6 pb-6 border-b dark:border-gray-700">
          <label
            htmlFor="bulan"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Pilih Bulan & Tahun Target
          </label>
          <input
            type="month"
            id="bulan"
            className="w-full md:w-auto p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)} // Akan otomatis fetch data baru
          />
        </div>

        {/* 6. ⬇️ DAFTAR INPUT DINAMIS DARI API ⬇️ */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Input Target Sales untuk Bulan: {bulan}</h3>
          
          {isLoading ? (
            <p>Memuat data...</p>
          ) : salesList.length === 0 ? (
            <p>Data sales tidak ditemukan. (Buat akun Sales di "Manajemen Pengguna")</p>
          ) : (
            salesList.map((sales) => (
              <div key={sales.id} className="flex flex-col md:flex-row items-center gap-4">
                <label className="w-full md:w-1/3 text-gray-900 dark:text-white font-medium">
                  {sales.nama}
                </label>
                <div className="w-full md:w-2/3 flex items-center">
                  <span className="p-2 bg-gray-100 border border-gray-300 rounded-l-lg dark:bg-gray-600 dark:border-gray-600">Rp</span>
                  <input
                    type="number"
                    className="w-full p-2 border-t border-b border-r border-gray-300 rounded-r-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={targets[sales.id] || ""} // Ambil data dari state
                    onChange={(e) => handleTargetChange(sales.id, e.target.value)}
                    placeholder="Contoh: 500000000"
                    required
                    min="0"
                  />
                </div>
              </div>
            ))
          )}
        </div>
        {/* ⬆️ ----------------------------------- ⬆️ */}
        
        {/* Tombol Submit */}
        <div className="flex justify-end pt-6 mt-6 border-t dark:border-gray-700">
          <button
            type="submit"
            disabled={isLoading || salesList.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Simpan Target"}
          </button>
        </div>
      </form>
    </div>
  );
}
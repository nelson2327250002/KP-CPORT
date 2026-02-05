// Isi BARU untuk: src/components/datamaster/ManajemenKategori.tsx

"use client"; 
import React, { useState, useEffect } from "react"; // 1. Import hook

// Tipe Kategori (HARUS SAMA DENGAN DI API)
type Kategori = {
  id: number;
  nama: string;
};

export default function ManajemenKategori() {
  const [namaKategori, setNamaKategori] = useState("");
  // 2. State untuk data live dan loading
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fungsi untuk mengambil data dari "mesin"
  const fetchKategori = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/categories'); // PANGGIL API
      const data = await response.json();
      setKategoriList(data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchKategori();
  }, []);

  // 5. Hubungkan 'handleSubmit' ke API POST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: namaKategori }),
      });
      if (!response.ok) {
        throw new Error('Gagal menyimpan kategori');
      }
      
      alert(`Kategori "${namaKategori}" berhasil disimpan.`);
      setNamaKategori("");
      fetchKategori(); // Refresh tabel
      
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan kategori.");
    }
  };

  // 6. Hubungkan 'handleHapus' ke API DELETE
  const handleHapus = async (id: number, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori ${nama}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/categories/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Gagal menghapus kategori');
        }
        alert(`Kategori ${nama} berhasil dihapus.`);
        fetchKategori(); // Refresh tabel
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus kategori.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. FORM PENGISIAN (DI ATAS) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Tambah Kategori Baru</h3>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Nama kategori baru..."
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* 2. LIST KATEGORI (DI BAWAH) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Daftar Kategori Saat Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="py-2">Nama Kategori</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* 7. Tampilkan loading atau data live */}
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Mengambil data...
                  </td>
                </tr>
              ) : kategoriList.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : (
                kategoriList.map((kategori) => (
                  <tr key={kategori.id} className="border-b dark:border-gray-700">
                    <td className="py-3 font-medium">{kategori.nama}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleHapus(kategori.id, kategori.nama)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
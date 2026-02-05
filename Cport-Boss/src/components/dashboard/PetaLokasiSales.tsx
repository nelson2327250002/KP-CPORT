"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import ikon marker secara manual untuk menghindari bug rendering Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Inisialisasi ikon default Leaflet
let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Tipe data sesuai dengan Entity Attendance di Backend
type SalesLocation = {
  id: number;
  salesName: string;
  lat: number | null;
  lng: number | null;
  checkInTime: string | null;
  lokasiCheckIn: string;
};

const formatWaktu = (waktu: string | null) => {
  if (!waktu) return "Belum ada update";
  return new Date(waktu).toLocaleString('id-ID', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export default function PetaLokasiSales() {
  const [locations, setLocations] = useState<SalesLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data dari endpoint yang memfilter checkOutTime IS NULL
        const response = await fetch('http://localhost:3000/attendance/all-locations');
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const result = await response.json();
        
        // LOGIKA PEMBERSIHAN PIN:
        // Jika result kosong (semua sales sudah logout), setLocations ke array kosong agar pin hilang
        if (!result || result.length === 0) {
          setLocations([]);
        } else {
          // Hanya simpan sales yang memiliki koordinat lat & lng yang valid
          const validLocations = result.filter(
            (sales: SalesLocation) => sales.lat !== null && sales.lng !== null
          );
          setLocations(validLocations);
        }
      } catch (error) {
        console.error("Gagal mengambil data lokasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Jalankan fetch saat pertama kali load
    fetchData();

    // Set interval lebih cepat (10 detik) agar pin hilang lebih instan setelah logout
    const interval = setInterval(fetchData, 10000); 
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 h-full w-full bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="font-semibold text-gray-500">Menghubungkan ke satelit GPS...</p>
      </div>
    );
  }
  
  const defaultPosition: [number, number] = [-2.5489, 118.0149]; // Fokus awal: Indonesia

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={defaultPosition}
        zoom={5}
        style={{
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render Marker hanya jika ada data sales aktif */}
        {locations.map(sales => (
          <Marker 
            key={sales.id} 
            position={[Number(sales.lat), Number(sales.lng)]}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h4 className="font-bold text-blue-600 text-base mb-1">{sales.salesName}</h4>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  <p className="mb-1"><b>📍 Lokasi:</b> {sales.lokasiCheckIn}</p>
                  <p><b>⏰ Check-in:</b> {formatWaktu(sales.checkInTime)}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Indikator Live Status */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">Live Tracking Aktif</span>
      </div>
    </div>
  );
}
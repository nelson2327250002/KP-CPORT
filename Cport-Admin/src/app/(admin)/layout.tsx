// Isi FINAL untuk: src/app/(admin)/layout.tsx (cport-admin-web)

"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 
import AppHeader from "@/layout/AppHeader"; 
import AppSidebar from "@/layout/AppSidebar"; 
import { SidebarProvider } from "@/context/SidebarContext"; // Wajib diimpor

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Blok "Gatekeeper"
  useEffect(() => {
    // ⬇️ TENTUKAN ROLE UNTUK PROYEK INI ⬇️
    const requiredRole = 'admin'; 
    // Menggunakan sessionStorage agar sesi terhapus saat tab browser ditutup
    const user = sessionStorage.getItem('cport-user'); 
    
    if (!user) {
      router.push('/login');
    } else {
      try {
        const userData = JSON.parse(user);
        if (userData.role?.toLowerCase() !== requiredRole.toLowerCase()) {
  localStorage.removeItem('cport-user');
  router.push('/login');
} else {
  setIsChecking(false);
}

      } catch (e) {
        sessionStorage.removeItem('cport-user');
        router.push('/login');
      }
    }
  }, [router]);

  // Layar loading
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Memeriksa autentikasi...
      </div>
    );
  }

  // Jika lolos, tampilkan dashboard
  return (
    // Membungkus AppHeader dan AppSidebar dalam SidebarProvider (karena mereka menggunakan useSidebar)
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar /> 
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <AppHeader />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
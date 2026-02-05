// Kembalikan ke kode ASLI: src/app/(admin)/layout.tsx (Gatekeeper DINYALAKAN)

"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 
import AppHeader from "@/layout/AppHeader"; 
import AppSidebar from "@/layout/AppSidebar"; 

export default function BossLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // 1. Blok "Gatekeeper" (DINYALAKAN KEMBALI)
  useEffect(() => {
    const user = localStorage.getItem('cport-user');
    
    if (!user) {
      router.push('/login');
    } else {
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'Boss') { 
          localStorage.removeItem('cport-user');
          router.push('/login');
        } else {
          setIsChecking(false);
        }
      } catch (e) {
        localStorage.removeItem('cport-user');
        router.push('/login');
      }
    }
  }, [router]);

  // 2. Layar loading (DINYALAKAN KEMBALI)
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Memeriksa autentikasi...
      </div>
    );
  }

  // 3. Jika lolos, tampilkan dashboard
  return (
    <div className="flex h-screen overflow-hidden relative">
      <AppSidebar /> 
      <div
  className="
    relative flex flex-1 flex-col
    overflow-y-auto overflow-x-hidden
    lg:ml-[290px]
  "
>
        <AppHeader />
        <main>
  <div className="mx-auto max-w-screen-2xl px-4 md:px-6 2xl:px-10 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
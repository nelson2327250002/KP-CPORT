// Isi BARU untuk: src/components/common/AuthGuard.tsx

"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // 1. Ini adalah Blok "Gatekeeper" (Satpam)
  useEffect(() => {
    // ⬇️ Ganti 'Admin' ke 'Boss' jika ini proyek cport-boss-web ⬇️
    const requiredRole = 'Admin'; 
    const user = sessionStorage.getItem('cport-user'); // Baca dari sessionStorage
    
    if (!user) {
      router.push('/login');
    } else {
      try {
        const userData = JSON.parse(user);
        if (userData.role !== requiredRole) { 
          sessionStorage.removeItem('cport-user');
          router.push('/login');
        } else {
          // Jika Lolos: Berhenti memeriksa dan tampilkan halaman
          setIsChecking(false);
        }
      } catch (e) {
        sessionStorage.removeItem('cport-user');
        router.push('/login');
      }
    }
  }, [router]);

  // 2. Tampilkan layar loading
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Memeriksa autentikasi...
      </div>
    );
  }

  // 3. Jika lolos, tampilkan children (Dashboard)
  return <>{children}</>;
}
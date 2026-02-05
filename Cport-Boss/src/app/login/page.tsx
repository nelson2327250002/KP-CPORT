"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // LOGIKA: Jika sudah ada sesi, jangan biarkan Boss lihat halaman login, langsung lempar ke dashboard
  useEffect(() => {
    const session = sessionStorage.getItem('cport-user');
    if (session) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Panggil API Login
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email atau password salah');
      }

      // 2. VALIDASI ROLE (Hanya Boss yang boleh masuk web ini)
      if (data.role !== 'Boss') {
        throw new Error('Akses ditolak. Akun ini bukan Boss.');
      }

      // 3. SIMPAN KE SESSION STORAGE (Gunakan Key yang sama dengan Dashboard)
      sessionStorage.setItem('cport-user', JSON.stringify(data));

      // 4. ARAHKAN KE DASHBOARD
      // Menggunakan window.location agar sesi terbaca segar oleh seluruh komponen
      window.location.href = '/';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            C-Port Boss
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Silakan login untuk akses Dashboard Eksekutif
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Email */}
          <div>
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Email Business
            </label>
            <input
              type="email"
              id="email"
              placeholder="boss@cport.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Input Password */}
          <div>
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </span>
            ) : (
              'Masuk ke Panel Boss'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Cport Executive System
          </p>
        </div>
      </div>
    </div>
  );
}
// Isi BARU untuk: src/app/login/page.tsx (cport-admin-web)

"use client"; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Panggil "mesin" API
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email atau password salah');
      }

      // 2. ⬇️ KEAMANAN BARU KHUSUS ADMIN ⬇️
      // Cek apakah yang login adalah Admin
      if (!data.role || data.role.toLowerCase() !== 'admin') {
  throw new Error('Akses ditolak. Akun ini bukan Admin.');
}
      // ⬆️ --------------------------- ⬆️

      // 3. Simpan data user ke localStorage
      sessionStorage.setItem('cport-user', JSON.stringify(data));

      // 4. Arahkan ke dashboard
      router.push('/'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          C-Port Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* ... (Input Email) ... */}
          <div>
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {/* ... (Input Password) ... */}
          <div className="mt-4">
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {isLoading ? 'Memeriksa...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
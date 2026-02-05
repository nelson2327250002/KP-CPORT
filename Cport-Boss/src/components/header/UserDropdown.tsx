// Isi BARU untuk: src/components/header/UserDropdown.tsx

"use client"; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSidebar } from '@/context/SidebarContext';

type User = {
  id: number;
  nama: string;
  email: string;
  role: 'Admin' | 'Boss' | 'Sales';
};

const UserDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  const trigger = useRef<any>(null); 
  const dropdown = useRef<any>(null); 

  useEffect(() => {
    // ⬇️ PERBAIKAN DI SINI ⬇️
    const userDataString = sessionStorage.getItem('cport-user'); // Baca dari sessionStorage
    // ⬆️ ------------------- ⬆️
    if (userDataString) {
      setUser(JSON.parse(userDataString));
    }
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        (trigger.current && trigger.current.contains(target))
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  const handleLogout = () => {
    // ⬇️ PERBAIKAN DI SINI ⬇️
    sessionStorage.removeItem('cport-user'); // Hapus dari sessionStorage
    // ⬆️ ------------------- ⬆️
    router.push('/login'); 
  };

  return (
    <div className="relative">
      {/* Tombol Avatar */}
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-gray-900 dark:text-white">
            {user ? user.nama : 'Memuat...'}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {user ? user.role : '...'}
          </span>
        </span>
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
           <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
           </svg>
        </div>
      </button>

      {/* Menu Dropdown (Profile, Edit, Logout) */}
      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-4 w-60 rounded-lg border border-gray-200 bg-white py-3 shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="px-4 py-2">
            <span className="block text-sm font-medium text-gray-900 dark:text-white">
              {user ? user.nama : '...'}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {user ? user.email : '...'}
            </span>
          </div>

          <hr className="my-2 border-gray-200 dark:border-gray-800" />

          <ul className="flex flex-col">
            <li>
              <Link
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                onClick={() => setDropdownOpen(false)}
              >
                Profil Saya
              </Link>
            </li>
            <li>
              <Link
                href="/profile/edit" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                onClick={() => setDropdownOpen(false)}
              >
                Edit Profil
              </Link>
            </li>
          </ul>

          <hr className="my-2 border-gray-200 dark:border-gray-800" />

          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
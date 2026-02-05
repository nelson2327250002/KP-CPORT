// Isi BARU untuk: src/layout/Backdrop.tsx

import { useSidebar } from "@/context/SidebarContext";
import React from "react";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      // ⬇️ PERBAIKAN: Ubah 'z-40' menjadi 'z-999' ⬇️
      className="fixed inset-0 z-999 bg-gray-900/50 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
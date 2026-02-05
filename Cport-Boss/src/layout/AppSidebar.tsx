"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard Eksekutif", 
    path: "/",
  },
  {
    icon: <PieChartIcon />,
    name: "Laporan & Analitik",
    path: "/laporan/analitik",
  },
  {
    icon: <TableIcon />,
    name: "Manajemen Target", 
    path: "/manajemen-target",
  },
  {
    icon: <PlugInIcon />,
    name: "Kontrol Sistem (Eks)",
    subItems: [
      { name: "Manajemen Pengguna", path: "/kontrol/pengguna" },
      { name: "Log Audit (CCTV)", path: "/kontrol/log-audit" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Data Master (Eks)",
    subItems: [
      { name: "Manajemen Produk", path: "/data-master/produk" },
      { name: "Manajemen Kategori", path: "/data-master/kategori" },
      { name: "Lihat Data Toko", path: "/data-master/toko" }, 
    ],
  },
  {
    icon: <PageIcon />,
    name: "Supervisi Keuangan",
    subItems: [
      { name: "Lihat Semua Pesanan", path: "/supervisi/pesanan" },
      { name: "Koreksi Tagihan Sales", path: "/supervisi/koreksi-tagihan" },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Pengumuman", 
    path: "/pengumuman",
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number; } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => 
      prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }
    );
  };

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems?.some(sub => isActive(sub.path))) {
          setOpenSubmenu({ type: menuType as "main" | "others", index });
          submenuMatched = true;
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span className={`${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link href={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link href={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 h-screen transition-all duration-300 z-50 border-r border-gray-200 dark:border-gray-800 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Dihilangkan. 
         Langsung mulai dengan menu navigasi menggunakan padding top (pt-10) 
      */}
      <div className="flex flex-col overflow-y-auto no-scrollbar pt-10">
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase text-gray-400 ${!isExpanded && !isHovered ? "text-center" : ""}`}>
            {isExpanded || isHovered || isMobileOpen ? "Menu Utama" : <HorizontaLDots />}
          </h2>
          {renderMenuItems(navItems, "main")}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
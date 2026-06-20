"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FaPlus, FaHome, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import logoLight from "../../../public/assets/logo-light.png";
import logoDark from "../../../public/assets/logo-dark.png";
import { useTheme } from "next-themes";
import ThemeToggle from "../ThemeToggle";
import { FaMoneyBillTrendUp, FaTicket } from "react-icons/fa6";
import { GrOverview } from "react-icons/gr";
import { MdFactCheck } from "react-icons/md";

const DashboardSidebar = () => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Implement sign-out logic here
  };

  const vendorMenu = [
    {
      key: "overview",
      label: "Overview",
      icon: GrOverview,
      href: "/dashboard/vendor",
    },
    {
      key: "Add Ticket",
      label: "Add Ticket",
      icon: FaPlus,
      href: "/dashboard/vendor/Add Ticket",
    },
    {
      key: "My Added Tickets",
      label: "My Added Tickets",
      icon: FaTicket,
      href: "/dashboard/vendor/My Added Tickets",
    },
    {
      key: "Requested Bookings",
      label: "Requested Bookings",
      icon: MdFactCheck,
      href: "/dashboard/vendor/Requested Bookings",
    },
    {
      key: "Revenue Overview",
      label: "Revenue Overview",
      icon: FaMoneyBillTrendUp,
      href: "/dashboard/vendor/Revenue Overview",
    },
  ];

  const role = session?.user?.role || "vendor";
  const currentLogo = mounted && theme === "dark" ? logoDark : logoLight;

  // Shared internal sidebar structure
  const renderSidebarContent = (isMobileView = false) => {
    const showExpandedState = isMobileView ? true : isExpanded;

    return (
      <div className="h-full w-full flex flex-col relative overflow-hidden select-none">
        {/* Decorative Branding Glow Nodes */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#AAFFC7]/10 dark:bg-[#215B63]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#67C090]/10 dark:bg-[#67C090]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header/Action Strip (Only handles toggle switch logic on Desktop) */}
        <div className="h-20 px-4 border-b border-black/5 dark:border-white/5 relative z-10 flex items-center justify-between gap-20 overflow-hidden shrink-0">
          <div
            className={`flex items-center gap-3 transition-opacity duration-200 ${showExpandedState ? "" : "hidden"}`}
          >
            <Link href="/" className="block shrink-0">
              <Image
                src={currentLogo}
                alt="Tikify Logo"
                width={90}
                height={26}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          <button
            onClick={() =>
              isMobileView ? setIsMobileOpen(false) : setIsExpanded(!isExpanded)
            }
            className="p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer text-sm mx-auto"
          >
            {isMobileView ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* User Profile Slot */}
        <div className="p-4 border-b border-black/5 dark:border-white/5 relative z-10 shrink-0 overflow-hidden">
          <div
            className={`flex items-center ${showExpandedState ? "gap-3 justify-start" : "justify-center"}`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#67C090]/60 shrink-0">
              <Image
                width={40}
                height={40}
                src={
                  session?.user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}&background=124170&color=fff&bold=true`
                }
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-200 ${showExpandedState ? "w-auto opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
            >
              <p className="text-slate-900 dark:text-white text-sm font-bold truncate leading-tight whitespace-nowrap">
                {session?.user?.name || "Tikify User"}
              </p>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#67C090] block mt-0.5">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links Layer */}
        <nav className="flex-grow overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 relative z-10 custom-scrollbar">
          {showExpandedState && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-3 pb-2 whitespace-nowrap transition-opacity duration-200">
              Navigation
            </p>
          )}
          {vendorMenu.map(({ key, label, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              onClick={() => isMobileView && setIsMobileOpen(false)}
              className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 group py-2.5 ${
                showExpandedState
                  ? "px-3 gap-3 justify-start"
                  : "px-0 justify-center"
              }`}
              title={!showExpandedState ? label : undefined}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-[#67C090] dark:group-hover:text-[#67C090] group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-150">
                <Icon size={16} />
              </span>
              <span
                className={`transition-all duration-200 whitespace-nowrap ${showExpandedState ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer Utilities */}
        <div className="p-3 border-t border-black/5 dark:border-white/5 space-y-1 relative z-10 shrink-0">
          <div
            className={`flex items-center py-1 transition-all ${showExpandedState ? "mb-2 ml-2 justify-start" : "mb-0 justify-center"}`}
          >
            <ThemeToggle />
          </div>

          <Link
            href="/"
            onClick={() => isMobileView && setIsMobileOpen(false)}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 py-2.5 ${
              showExpandedState
                ? "px-3 gap-3 justify-start"
                : "px-0 justify-center"
            }`}
            title={!showExpandedState ? "Back to Site" : undefined}
          >
            <span className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
              <FaHome size={14} />
            </span>
            <span
              className={`transition-all duration-200 whitespace-nowrap ${showExpandedState ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}
            >
              Back to Site
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/5 transition-all duration-150 cursor-pointer text-left py-2.5 ${
              showExpandedState
                ? "px-3 gap-3 justify-start"
                : "px-0 justify-center"
            }`}
            title={!showExpandedState ? "Sign Out" : undefined}
          >
            <span className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
              <FaSignOutAlt size={14} />
            </span>
            <span
              className={`transition-all duration-200 whitespace-nowrap ${showExpandedState ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Mobile Top Header Navbar (Hidden on lg screens) */}
      <div className="lg:hidden w-full bg-white dark:bg-slate-950 border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="block">
          <Image
            src={currentLogo}
            alt="Tikify Logo"
            width={95}
            height={28}
            priority
            className="object-contain"
          />
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
        >
          <FaBars size={16} />
        </button>
      </div>

      {/* 2. Desktop Thin Expandable Sidebar Strip Layout (Hidden on Mobile) */}
      <aside
        className={`hidden lg:flex h-screen sticky top-0 left-0 z-40 flex-col bg-white/90 dark:bg-slate-950/90 border-r border-black/5 dark:border-white/5 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 3. Mobile Sliding Drawer Overlay Menu Shell */}
      <div
        className={`fixed inset-0 z-50 lg:hidden flex transition-opacity duration-300 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Darkened blur background click interceptor panel */}
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Sliding body content container pane */}
        <div
          className={`relative w-64 max-w-xs h-full bg-white dark:bg-slate-950 border-r border-black/5 dark:border-white/5 transform transition-transform duration-300 ease-out z-10 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(true)}
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;

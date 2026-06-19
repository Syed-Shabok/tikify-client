"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Dropdown } from "@heroui/react";
import Image from "next/image";
import logoLight from "../../public/assets/logo-light.png";
import logoDark from "../../public/assets/logo-dark.png";

import ThemeToggle from "./ThemeToggle";
import { authClient, useSession } from "@/lib/auth-client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  console.log("Session in Navbar: ", session);

  const mockUser = {
    name: "Alex Rider",
    email: "alex@ticketbari.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  };

  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "All Tickets", path: "/all-tickets" },
  ];

  const allLinks = session
    ? [...publicLinks, { label: "Dashboard", path: "/dashboard" }]
    : publicLinks;

  const isActive = (path) => pathname === path;
  const currentLogo = mounted && theme === "dark" ? logoDark : logoLight;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#124170]/70 backdrop-blur-md transition-all duration-300 border-b">
      <div className="mx-auto container h-20 flex items-center justify-between px-6">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center transition-transform active:scale-98"
        >
          <div className="relative h-9 w-[130px] flex items-center">
            <Image
              src={currentLogo}
              alt="Tikify Logo"
              width={110}
              height={32}
              priority
              className="object-contain"
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center h-13 bg-gray-100/60 dark:bg-black/20 px-2 rounded-full border border-gray-200/40 dark:border-white/5 shadow-inner">
          <ul className="flex items-center gap-3">
            {allLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`h-9 inline-flex items-center justify-center text-xs font-bold tracking-wider uppercase px-4  rounded-full transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-white dark:bg-[#215B63] text-[#124170] dark:text-[#AAFFC7] shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-[#124170] dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Utility Section */}
        <div className="flex items-center gap-3.5">
          <ThemeToggle />

          {session ? (
            <Dropdown>
              <Dropdown.Trigger>
                <div className="flex items-center gap-2 cursor-pointer group select-none bg-gray-50 dark:bg-[#215B63]/40 pl-2 pr-3 py-1.5 rounded-full border border-gray-200/30 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-[#215B63]/70 transition-all">
                  <div className="rounded-full ring-2 ring-[#67C090] ring-offset-2 dark:ring-offset-[#124170] overflow-hidden w-7 h-7 shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      width={20}
                      height={20}
                      src={session?.user?.image}
                      alt={session?.user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden lg:inline text-xs font-bold tracking-wide text-[#124170] dark:text-gray-200">
                    {session?.user?.name.split(" ")[0]}
                  </span>
                </div>
              </Dropdown.Trigger>
              <Dropdown.Popover className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl bg-white dark:bg-[#124170] p-1.5">
                <Dropdown.Menu className="w-70">
                  <Dropdown.Section>
                    <Dropdown.Item
                      id="user-info"
                      textValue="Account User Profile Summary"
                      className="cursor-default opacity-100 bg-gray-50/50 dark:bg-black/10 rounded-xl p-3 mb-1.5"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[#124170] dark:text-[#AAFFC7] text-xs truncate">
                          {session?.user?.email}
                        </span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Section>
                    <Dropdown.Item
                      id="profile"
                      textValue="My Profile Dashboard"
                      className="rounded-xl"
                    >
                      <Link
                        href="/dashboard/profile"
                        className="block w-full text-xs font-bold tracking-wide text-gray-600 dark:text-gray-300 hover:text-[#67C090]"
                      >
                        My Profile
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="logout"
                      textValue="Sign Out Context"
                      className="rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold tracking-wide"
                      onAction={handleLogout}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <div className="hidden md:flex items-center gap-2.5">
              <Link
                href="/auth/signin"
                className="text-xs font-bold tracking-wider uppercase text-[#215B63] dark:text-gray-300 hover:text-[#124170] dark:hover:text-[#67C090] transition-colors px-4 py-2.5 rounded-full"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-xs font-bold tracking-wider uppercase bg-[#124170] dark:bg-[#67C090] text-[#AAFFC7] dark:text-[#124170] hover:scale-[1.02] active:scale-[0.98] transition-all px-5 py-2.5 rounded-full shadow-md shadow-gray-200 dark:shadow-none"
              >
                Register
              </Link>
            </div>
          )}

          {/* Burger Button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-[#215B63]/40 text-[#124170] dark:text-gray-300 transition-all active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation viewport"
            aria-expanded={isMenuOpen}
          >
            <div className="w-5 h-5 flex flex-col items-center justify-center relative">
              <span
                className={`w-4 h-0.5 bg-current rounded-full absolute transition-all duration-300 ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                className={`w-4 h-0.5 bg-current rounded-full absolute transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`w-4 h-0.5 bg-current rounded-full absolute transition-all duration-300 ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Floating Canvas Overlay Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#124170]/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 transition-all duration-300 shadow-2xl z-50 animate-appearance-in">
          <ul className="flex flex-col gap-1.5 p-4">
            {allLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-xs font-bold uppercase tracking-wider py-3.5 px-5 rounded-2xl transition-all ${
                    isActive(link.path)
                      ? "text-[#124170] bg-[#AAFFC7] font-black"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {!session && (
              <>
                <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
                <li className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-2xl bg-[#215B63] dark:bg-[#67C090] text-white dark:text-[#124170] shadow-sm"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

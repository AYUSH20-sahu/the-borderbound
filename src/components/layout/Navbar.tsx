"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, Flame, ChevronRight, UserCircle } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "The Concept", href: "/about" },
  { name: "Contestants", href: "/contestants" },
  { name: "Rules & Terms", href: "/rules" },
  { name: "Updates", href: "/updates" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#08090D]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/80 py-3"
          : "bg-gradient-to-b from-[#08090D] via-[#08090D]/60 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-950 border border-red-500/40 shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-lg bg-red-500/20 blur-sm group-hover:blur-md transition-all opacity-0 group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-widest text-lg sm:text-xl text-white uppercase group-hover:text-red-400 transition-colors">
                The Borderbound
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Live S1
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Official Reality Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-xs lg:text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
                  isActive
                    ? "text-red-400 bg-red-500/10 border border-red-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/status"
            className="text-xs text-slate-400 hover:text-white transition-colors tracking-wide uppercase font-mono px-2 py-1"
          >
            Check Status
          </Link>
          <Link
            href="/apply"
            className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-red-700 to-amber-600 shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-red-400/30"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Apply Now</span>
            <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/apply"
            className="px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-red-600 border border-red-400/30 shadow"
          >
            Apply
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-white/5 border border-white/10"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 pt-3 pb-6 bg-[#0B0E14]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase flex items-center justify-between ${
                    isActive
                      ? "text-red-400 bg-red-500/10 border border-red-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/status"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-mono tracking-wide text-slate-400 hover:text-white uppercase flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                Check Application Status
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-mono tracking-wide text-slate-500 hover:text-slate-300 uppercase"
              >
                Admin Portal
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

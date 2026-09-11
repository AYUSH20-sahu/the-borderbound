"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes render in full view without public marketing Navbar & Footer
    return <main className="flex-1 z-10">{children}</main>;
  }

  return (
    <>
      {/* Global Public Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 z-10 pt-20 sm:pt-24">{children}</main>

      {/* Global Public Footer */}
      <Footer />
    </>
  );
}

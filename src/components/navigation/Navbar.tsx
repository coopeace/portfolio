"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X } from "lucide-react";
// ThemeSwitcher and AudioToggle remain accessible within MobileNav drawer
import { MobileNav, NAV_ITEMS } from "./MobileNav";
import { playClickSound, playHoverSound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled
          ? "bg-[#010206]/90 backdrop-blur-xl border-b border-border shadow-2xl shadow-black/60"
          : "bg-[#010206]/70 backdrop-blur-md border-b border-border/40"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Callsign */}
        <Link
          href="/"
          onClick={playClickSound}
          onMouseEnter={playHoverSound}
          className="group flex items-center space-x-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1 -ml-1"
        >
          <div className="p-1.5 rounded-md bg-surface border border-border group-hover:border-accent/50 transition-colors">
            <Terminal className="w-4 h-4 text-accent group-hover:scale-110 transition-transform duration-150" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-bold tracking-wider text-foreground">
              SHISHIR DEV
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-muted border border-border px-1.5 py-0.5 rounded bg-surface">
              SYSTEMS &amp; BACKEND
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center space-x-1 lg:space-x-2"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? (pathname ?? "") === "/"
                : (pathname ?? "") === item.href ||
                  (pathname ?? "").startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                className={cn(
                  "font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-md transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "text-accent bg-surface-elevated border border-accent/30 font-medium shadow-sm shadow-[0_0_10px_rgb(var(--accent-rgb)/0.15)]"
                    : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
                )}
              >
                <span className="flex items-center space-x-1.5">
                  {item.callsign && (
                    <span className="text-[10px] text-muted/60">{item.callsign}</span>
                  )}
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Tray */}
        <div className="flex items-center">
          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsMobileOpen((prev) => !prev);
            }}
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-drawer"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-surface border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          >
            {isMobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Navigation Drawer */}
    <MobileNav
      isOpen={isMobileOpen}
      onClose={handleCloseMobile}
    />
  </>
  );
}

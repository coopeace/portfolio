"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Terminal } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { playClickSound, playHoverSound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  callsign?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", callsign: "00" },
  { label: "Missions", href: "/projects", callsign: "01" },
  { label: "Telemetry", href: "/telemetry", callsign: "02" },
  { label: "About", href: "/about", callsign: "03" },
  { label: "Logs", href: "/blog", callsign: "04" },
  { label: "Contact", href: "/contact", callsign: "05" },
];

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items?: NavItem[];
}

export function MobileNav({
  isOpen,
  onClose,
  items = NAV_ITEMS,
}: MobileNavProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const focusFirstElement = () => {
      if (!drawerRef.current) return;
      const focusableElements =
        drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    };

    const timer = setTimeout(focusFirstElement, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      id="mobile-nav-drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:w-80 sm:max-w-sm h-full min-h-[100dvh] bg-surface border-l border-border shadow-2xl flex flex-col justify-between p-6 overflow-y-auto z-50"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <Link
              href="/"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="flex items-center space-x-2 group"
            >
              <Terminal className="w-5 h-5 text-accent" />
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                  SHISHIR DEV
                </span>
                <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
                  BACKEND &amp; SYSTEMS
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated border border-transparent hover:border-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-1" aria-label="Mobile Routes">
            {items.map((item) => {
              const isActive =
                item.href === "/"
                  ? (pathname ?? "") === "/"
                  : (pathname ?? "") === item.href ||
                    (pathname ?? "").startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    playClickSound();
                    onClose();
                  }}
                  onMouseEnter={playHoverSound}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-lg font-mono text-sm tracking-wide transition-all min-h-[48px]",
                    isActive
                      ? "text-accent bg-surface-elevated font-semibold border border-accent/30 shadow-sm"
                      : "text-muted hover:text-foreground hover:bg-surface-elevated border border-transparent"
                  )}
                >
                  <span className="flex items-center space-x-3">
                    {item.callsign && (
                      <span className="text-xs text-muted/60">
                        {item.callsign}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="pt-6 border-t border-border mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <AudioToggle />
            <ThemeSwitcher variant="cycle" />
          </div>

          <div className="pt-2 text-xs font-mono text-muted space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span>STATUS: MISSION ACTIVE</span>
              </div>
              <Link
                href="/studio"
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-mono transition-colors border",
                  (pathname ?? "") === "/studio"
                    ? "text-accent bg-surface-elevated border-accent/40"
                    : "text-muted hover:text-foreground border-border/50"
                )}
              >
                Studio ↗
              </Link>
            </div>
            <div className="text-muted/70">
              STATION: Durgapur, IN
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

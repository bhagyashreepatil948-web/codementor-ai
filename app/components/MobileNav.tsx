"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    name: "AI Mentor",
    href: "/chat",
    icon: "💬",
  },
  {
    name: "Explain Code",
    href: "/explain",
    icon: "📖",
  },
  {
    name: "Debug Code",
    href: "/debug",
    icon: "🐛",
  },
  {
    name: "Practice",
    href: "/practice",
    icon: "🧠",
  },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#091321]/95 backdrop-blur-xl border-b border-white/10 px-5 py-4 flex items-center justify-between">
        <Link href="/dashboard" onClick={closeMenu}>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Code<span className="text-cyan-400">Mentor AI</span>
          </h1>
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 hover:border-cyan-400/30 transition-all"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="md:hidden fixed inset-0 top-[76px] z-40 bg-black/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
        className="md:hidden fixed top-[76px] right-0 z-50 h-[calc(100vh-76px)] w-72 bg-[#091321]/95 backdrop-blur-xl border-l border-white/10 p-6"
      >
        {/* Menu Title */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Navigation
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const active = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: active ? 0 : 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border ${
                    active
                      ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/5"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  <span className="font-medium text-sm">
                    {item.name}
                  </span>

                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Card */}
        <div className="absolute bottom-8 left-6 right-6 bg-gradient-to-br from-cyan-400/[0.08] to-white/[0.02] border border-cyan-400/10 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <span>🤖</span>

            <p className="text-sm text-cyan-400 font-semibold">
              AI Learning Assistant
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-3 leading-5">
            Learn faster. Debug smarter. Build better.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-xs text-emerald-400">
              AI Online
            </span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
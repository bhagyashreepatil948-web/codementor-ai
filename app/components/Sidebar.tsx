"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 w-64 h-screen bg-[#091321]/90 backdrop-blur-xl border-r border-white/10 flex-col p-6">
      
      {/* Logo */}
      <Link href="/dashboard" className="mb-12">
        <motion.h1
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold tracking-tight cursor-pointer"
        >
          Code
          <span className="text-cyan-400">
            Mentor AI
          </span>
        </motion.h1>

        <p className="text-xs text-gray-500 mt-1">
          Your AI Coding Companion
        </p>
      </Link>

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
                className={`group px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border ${
                  active
                    ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/20 shadow-lg shadow-cyan-400/5"
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
                  <motion.span
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom AI Card */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="mt-auto bg-gradient-to-br from-cyan-400/[0.08] to-white/[0.02] border border-cyan-400/10 rounded-2xl p-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>

          <p className="text-sm text-cyan-400 font-semibold">
            AI Learning Assistant
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-3 leading-5">
          Learn faster. Debug smarter. Build better.
        </p>

        <div className="flex items-center gap-2 mt-4">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />

          <span className="text-xs text-emerald-400">
            AI Online
          </span>
        </div>
      </motion.div>

    </aside>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function Dashboard() {
  const [explainCount, setExplainCount] = useState(0);
  const [debugCount, setDebugCount] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [streak, setStreak] = useState(0);

  const [lastActivity, setLastActivity] = useState(
    "Start learning with CodeMentor AI"
  );

  const [lastActivityTime, setLastActivityTime] = useState("");

  /* =========================
     MOUSE 3D EFFECT
  ========================= */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
  });

  const rotateY = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;

      mouseX.set((x - 0.5) * 8);
      mouseY.set((y - 0.5) * -8);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {
    const loadDashboardData = () => {
      setExplainCount(
        Number(localStorage.getItem("explainCount") || "0")
      );

      setDebugCount(
        Number(localStorage.getItem("debugCount") || "0")
      );

      setProblemsSolved(
        Number(localStorage.getItem("problemsSolved") || "0")
      );

      setStreak(
        Number(localStorage.getItem("streak") || "0")
      );

      setLastActivity(
        localStorage.getItem("lastActivity") ||
          "Start learning with CodeMentor AI"
      );

      setLastActivityTime(
        localStorage.getItem("lastActivityTime") || ""
      );
    };

    loadDashboardData();

    window.addEventListener("storage", loadDashboardData);

    return () => {
      window.removeEventListener("storage", loadDashboardData);
    };
  }, []);

  const totalActivity =
    explainCount + debugCount + problemsSolved;

  /* =========================
     STATS
  ========================= */

  const stats = [
    {
      title: "Code Explained",
      value: explainCount,
      icon: "📖",
      description: "Programs analyzed with AI",
    },
    {
      title: "Bugs Fixed",
      value: debugCount,
      icon: "🐛",
      description: "Debugging sessions completed",
    },
    {
      title: "Problems Solved",
      value: problemsSolved,
      icon: "🧠",
      description: "Coding challenges completed",
    },
    {
      title: "Learning Streak",
      value: streak,
      icon: "🔥",
      description: "Keep learning every day",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#02050b] text-white">

      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Main Glow */}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[25%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-60 top-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-60 bottom-10 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[130px]"
        />

        {/* Floating Particles */}

        {Array.from({ length: 22 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.7, 0.15],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 3 + (index % 5),
              repeat: Infinity,
              delay: index * 0.25,
              ease: "easeInOut",
            }}
            className="absolute h-1 w-1 rounded-full bg-cyan-300"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 19) % 100}%`,
            }}
          />
        ))}

        {/* Floating Code Symbols */}

        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[15%] text-7xl font-black text-cyan-400/[0.07]"
        >
          {"{}"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[8%] top-[20%] text-7xl font-black text-cyan-300/[0.07]"
        >
          {"</>"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] left-[7%] text-6xl font-black text-blue-400/[0.06]"
        >
          AI
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[15%] right-[10%] text-7xl font-black text-cyan-400/[0.06]"
        >
          01
        </motion.div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <Sidebar />

      <MobileNav />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="relative z-10 min-h-screen pt-[76px] md:ml-64 md:pt-0">

        <div className="mx-auto max-w-7xl p-5 md:p-10">

          {/* =================================================
              HEADER
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: -30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-10"
          >

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <div className="mb-4 flex items-center gap-3">

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-cyan-400">
                    CODEMENTOR AI
                  </span>

                  <span className="flex items-center gap-2 text-xs text-emerald-400">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />

                    AI ONLINE

                  </span>

                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-6xl">

                  Welcome back,
                  <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Developer 👋
                  </span>

                </h1>

                <p className="mt-4 max-w-xl text-gray-500 md:text-lg">
                  Your personal AI coding command center.
                  Learn, debug, practice and grow every day.
                </p>

              </div>

              {/* TOTAL ACTIVITY */}

              <motion.div
                whileHover={{
                  scale: 1.04,
                  rotateY: 5,
                }}
                style={{
                  perspective: 1000,
                }}
                className="relative"
              >

                <div className="absolute inset-0 rounded-3xl bg-cyan-400/10 blur-2xl" />

                <div className="relative rounded-3xl border border-cyan-400/20 bg-[#07111d]/90 px-7 py-5 shadow-[0_0_50px_rgba(34,211,238,0.08)] backdrop-blur-2xl">

                  <p className="text-xs font-semibold tracking-widest text-gray-500">
                    TOTAL ACTIVITY
                  </p>

                  <motion.p
                    key={totalActivity}
                    initial={{
                      scale: 0.6,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    className="mt-1 text-5xl font-black text-cyan-400"
                  >
                    {totalActivity}
                  </motion.p>

                  <p className="mt-1 text-xs text-gray-600">
                    Learning actions completed
                  </p>

                </div>

              </motion.div>

            </div>
          </motion.div>

          {/* =================================================
              AI CORE + STREAK
          ================================================= */}

          <div className="mb-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

            {/* AI CORE */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
              }}
              className="relative min-h-[390px] overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[#06101b]/80 shadow-[0_0_80px_rgba(34,211,238,0.06)] backdrop-blur-2xl"
            >

              {/* Grid */}

              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Title */}

              <div className="absolute left-7 top-7 z-20">

                <p className="text-xs font-bold tracking-[0.25em] text-cyan-400">
                  AI CORE
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Learning Intelligence
                </h2>

                <p className="mt-2 max-w-xs text-sm text-gray-500">
                  Your AI mentor is ready to analyze,
                  explain and guide your coding journey.
                </p>

              </div>

              {/* 3D Core */}

              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformPerspective: 1000,
                }}
                className="absolute left-1/2 top-[55%] h-56 w-56 -translate-x-1/2 -translate-y-1/2"
              >

                {/* Outer Ring */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border border-cyan-400/20"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-5 rounded-full border border-dashed border-cyan-400/30"
                />

                {/* Glow */}

                <motion.div
                  animate={{
                    scale: [0.9, 1.08, 0.9],
                    opacity: [0.35, 0.6, 0.35],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute inset-10 rounded-full bg-cyan-400/20 blur-2xl"
                />

                {/* Core */}

                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/50 bg-[#071522] shadow-[0_0_50px_rgba(34,211,238,0.35)]"
                >

                  <div className="text-center">

                    <div className="text-4xl">
                      🤖
                    </div>

                    <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-cyan-400">
                      ONLINE
                    </p>

                  </div>

                </motion.div>

                {/* Orbiting Dot */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >

                  <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,1)]" />

                </motion.div>

              </motion.div>

              {/* Bottom Status */}

              <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between">

                <div className="flex items-center gap-2 text-xs text-gray-500">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                  Neural system active

                </div>

                <span className="text-xs font-semibold text-cyan-400">
                  READY TO LEARN
                </span>

              </div>

            </motion.div>

            {/* STREAK */}

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="relative overflow-hidden rounded-[2rem] border border-orange-400/15 bg-[#07101a]/90 p-7 backdrop-blur-2xl"
            >

              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-500/10 blur-[80px]" />

              <div className="relative">

                <p className="text-xs font-bold tracking-[0.2em] text-orange-400">
                  CURRENT STREAK
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Keep the momentum
                </h2>

                {/* Ring */}

                <div className="relative mx-auto my-8 flex h-48 w-48 items-center justify-center">

                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border border-dashed border-orange-400/30"
                  />

                  <motion.div
                    animate={{
                      scale: [1, 1.04, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-5 rounded-full border-4 border-orange-400/10"
                  />

                  <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-orange-400/30 bg-orange-400/5 shadow-[0_0_50px_rgba(251,146,60,0.15)]">

                    <span className="text-5xl font-black text-orange-400">
                      {streak}
                    </span>

                    <span className="text-xs font-semibold text-gray-500">
                      DAYS
                    </span>

                  </div>

                </div>

                <div className="text-center">

                  <p className="text-2xl">
                    🔥
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    {streak > 0
                      ? "Amazing! Keep your streak alive."
                      : "Start learning today and build your streak."}
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat, index) => (

              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -10,
                  rotateX: 4,
                  rotateY: -4,
                  scale: 1.02,
                }}
                style={{
                  transformPerspective: 1000,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#07111d]/80 p-6 shadow-xl backdrop-blur-2xl"
              >

                {/* Hover Glow */}

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.06] to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold tracking-wider text-gray-500">
                        {stat.title}
                      </p>

                      <motion.h3
                        key={stat.value}
                        initial={{
                          scale: 0.5,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        className="mt-3 text-4xl font-black"
                      >
                        {stat.value}
                      </motion.h3>

                    </div>

                    <motion.div
                      whileHover={{
                        rotate: 15,
                        scale: 1.15,
                      }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-lg"
                    >
                      {stat.icon}
                    </motion.div>

                  </div>

                  <p className="mt-5 text-xs leading-5 text-gray-600">
                    {stat.description}
                  </p>

                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${Math.min(
                          Number(stat.value) * 4 + 10,
                          100
                        )}%`,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: 0.5 + index * 0.1,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
            className="mb-10"
          >

            <div className="mb-5">

              <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
                LEARNING HUB
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Choose your mission
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {/* EXPLAIN */}

              <Link href="/explain">

                <motion.div
                  whileHover={{
                    y: -10,
                    rotateX: 3,
                    rotateY: -3,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  style={{
                    transformPerspective: 1000,
                  }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-cyan-400/15 bg-[#07111d]/85 p-7 backdrop-blur-2xl"
                >

                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />

                  <div className="relative">

                    <motion.div
                      whileHover={{
                        rotateY: 180,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl"
                    >
                      📖
                    </motion.div>

                    <h3 className="mt-6 text-xl font-bold transition group-hover:text-cyan-400">
                      Explain Code
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Understand your code step by step with
                      beginner-friendly AI explanations.
                    </p>

                    <p className="mt-6 text-sm font-bold text-cyan-400">
                      Start Explaining →
                    </p>

                  </div>

                </motion.div>

              </Link>

              {/* DEBUG */}

              <Link href="/debug">

                <motion.div
                  whileHover={{
                    y: -10,
                    rotateX: 3,
                    rotateY: 3,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  style={{
                    transformPerspective: 1000,
                  }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-red-400/15 bg-[#07111d]/85 p-7 backdrop-blur-2xl"
                >

                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-400/10 blur-3xl transition group-hover:bg-red-400/20" />

                  <div className="relative">

                    <motion.div
                      animate={{
                        rotate: [0, -8, 8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-3xl"
                    >
                      🐛
                    </motion.div>

                    <h3 className="mt-6 text-xl font-bold transition group-hover:text-red-400">
                      Debug Code
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Find errors, understand why they happen,
                      and learn how to fix them.
                    </p>

                    <p className="mt-6 text-sm font-bold text-red-400">
                      Debug My Code →
                    </p>

                  </div>

                </motion.div>

              </Link>

              {/* PRACTICE */}

              <Link href="/practice">

                <motion.div
                  whileHover={{
                    y: -10,
                    rotateX: 3,
                    rotateY: -3,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  style={{
                    transformPerspective: 1000,
                  }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-purple-400/15 bg-[#07111d]/85 p-7 backdrop-blur-2xl"
                >

                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-400/10 blur-3xl transition group-hover:bg-purple-400/20" />

                  <div className="relative">

                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-3xl"
                    >
                      🧠
                    </motion.div>

                    <h3 className="mt-6 text-xl font-bold transition group-hover:text-purple-400">
                      Practice Problems
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Solve coding challenges and get AI feedback
                      on your solutions.
                    </p>

                    <p className="mt-6 text-sm font-bold text-purple-400">
                      Start Practicing →
                    </p>

                  </div>

                </motion.div>

              </Link>

            </div>

          </motion.div>

          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="grid gap-6 pb-10 lg:grid-cols-[1.2fr_0.8fr]">

            {/* RECENT ACTIVITY */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.6,
              }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#07111d]/85 p-7 backdrop-blur-2xl"
            >

              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl" />

              <div className="relative">

                <div className="mb-7 flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
                      ACTIVITY
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      Recent Activity
                    </h2>

                  </div>

                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="text-2xl"
                  >
                    📊
                  </motion.div>

                </div>

                <div className="rounded-2xl border border-white/5 bg-[#02060c]/70 p-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl">
                      ⚡
                    </div>

                    <div>

                      <p className="text-gray-300">
                        {lastActivity}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        {lastActivityTime ||
                          "No recent activity yet"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Activity bars */}

                <div className="mt-6 flex h-20 items-end gap-2">

                  {[35, 55, 42, 75, 50, 85, 65, 95, 72, 100].map(
                    (height, index) => (

                      <motion.div
                        key={index}
                        initial={{
                          height: 0,
                        }}
                        animate={{
                          height: `${height}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: 0.7 + index * 0.05,
                        }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-500/20 to-cyan-400/80"
                      />

                    )
                  )}

                </div>

                <div className="mt-2 flex justify-between text-[10px] text-gray-700">

                  <span>START</span>
                  <span>LEARNING ACTIVITY</span>
                  <span>NOW</span>

                </div>

              </div>

            </motion.div>

            {/* AI MENTOR */}

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.7,
              }}
              whileHover={{
                y: -6,
              }}
              className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#06121e]/90 p-7 backdrop-blur-2xl"
            >

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-[70px]"
              />

              <div className="relative">

                <div className="flex items-center gap-4">

                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-3xl shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                  >
                    🤖
                  </motion.div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-xl font-bold">
                        AI Mentor
                      </h2>

                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Your coding companion
                    </p>

                  </div>

                </div>

                <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

                  <p className="text-sm leading-6 text-gray-400">
                    "Have a coding question? Ask me about
                    programming concepts, errors, algorithms
                    or anything you're learning."
                  </p>

                </div>

                <Link href="/mentor">

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-4 font-bold text-black shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                  >
                    Open AI Mentor →
                  </motion.button>

                </Link>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

type DebugResult = {
  errors: string;
  why: string;
  fixedCode: string;
  concept: string;
  tip: string;
};

export default function DebugCode() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [result, setResult] = useState<DebugResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActiveDate = localStorage.getItem("lastActiveDate");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let currentStreak = Number(
      localStorage.getItem("streak") || "0"
    );

    if (lastActiveDate === today) return;

    if (lastActiveDate === yesterday.toDateString()) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem("streak", String(currentStreak));
    localStorage.setItem("lastActiveDate", today);
  };

  const parseResult = (text: string): DebugResult => {
    const errors =
      text.match(
        /ERRORS:\s*([\s\S]*?)(?=\n\s*WHY:|$)/i
      )?.[1]?.trim() || "";

    const why =
      text.match(
        /WHY:\s*([\s\S]*?)(?=\n\s*FIXED_CODE:|$)/i
      )?.[1]?.trim() || "";

    const fixedCode =
      text.match(
        /FIXED_CODE:\s*([\s\S]*?)(?=\n\s*CONCEPT:|$)/i
      )?.[1]?.trim() || "";

    const concept =
      text.match(
        /CONCEPT:\s*([\s\S]*?)(?=\n\s*TIP:|$)/i
      )?.[1]?.trim() || "";

    const tip =
      text.match(
        /TIP:\s*([\s\S]*)$/i
      )?.[1]?.trim() || "";

    return {
      errors,
      why,
      fixedCode,
      concept,
      tip,
    };
  };

  const debugCode = async () => {
    if (!code.trim()) {
      alert("Please paste your code first!");
      return;
    }

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          action: "debug",
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to debug code"
        );
      }

      if (!data?.result) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      const parsed = parseResult(data.result);

      setResult(parsed);

      const count =
        Number(
          localStorage.getItem("debugCount") || "0"
        ) + 1;

      localStorage.setItem(
        "debugCount",
        String(count)
      );

      localStorage.setItem(
        "lastActivity",
        `Debugged ${language} code with AI`
      );

      localStorage.setItem(
        "lastActivityTime",
        new Date().toLocaleString()
      );

      updateStreak();

      window.dispatchEvent(
        new Event("storage")
      );
    } catch (error) {
      setResult({
        errors:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        why: "",
        fixedCode: "",
        concept: "",
        tip: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyFixedCode = async () => {
    if (!result?.fixedCode) return;

    try {
      await navigator.clipboard.writeText(
        result.fixedCode
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy fixed code.");
    }
  };

  const clearEditor = () => {
    setCode("");
    setResult(null);
    setCopied(false);
  };

  const lineCount = code
    ? code.split("\n").length
    : 0;

  return (
    <main className="min-h-screen bg-[#050b14] text-white overflow-hidden">

      {/* ================================================= */}
      {/* PREMIUM ANIMATED BACKGROUND */}
      {/* ================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

        <motion.div
          animate={{
            x: [0, 45, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-48
            -left-40
            w-[550px]
            h-[550px]
            rounded-full
            bg-cyan-500/10
            blur-[140px]
          "
        />

        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 35, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-1/3
            -right-48
            w-[600px]
            h-[600px]
            rounded-full
            bg-red-500/[0.045]
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: [0, 25, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -bottom-48
            left-1/3
            w-[500px]
            h-[500px]
            rounded-full
            bg-blue-500/5
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

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
          className="
            absolute
            top-24
            left-[8%]
            text-7xl
            font-bold
            text-red-400/[0.045]
          "
        >
          {"<!"}
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
          className="
            absolute
            top-32
            right-[8%]
            text-6xl
            font-bold
            text-cyan-300/[0.05]
          "
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
          className="
            absolute
            top-[48%]
            left-[4%]
            text-5xl
            font-bold
            text-red-400/[0.045]
          "
        >
          BUG
        </motion.div>

        <motion.div
          animate={{
            y: [0, 22, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-24
            right-[10%]
            text-6xl
            font-bold
            text-cyan-400/[0.05]
          "
        >
          FIX
        </motion.div>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <Sidebar />
      <MobileNav />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <section
        className="
          relative
          z-10
          min-h-screen
          pt-[100px]
          p-5
          sm:p-6
          md:p-10
          md:pt-10
          md:ml-64
        "
      >
        <div className="max-w-6xl mx-auto">

          {/* BACK */}

          <motion.div
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <Link
              href="/dashboard"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                text-gray-500
                hover:text-cyan-400
                transition-all
              "
            >
              <span className="text-lg">←</span>
              Back to Dashboard
            </Link>
          </motion.div>

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-8 mb-10"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">

              <motion.span
                whileHover={{
                  scale: 1.05,
                }}
                className="
                  px-3
                  py-1.5
                  rounded-full
                  bg-red-400/10
                  border
                  border-red-400/20
                  text-red-400
                  text-xs
                  font-bold
                  tracking-widest
                "
              >
                AI DEBUGGER
              </motion.span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-emerald-400
                "
              >
                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.8)]
                    animate-pulse
                  "
                />
                AI Online
              </span>
            </div>

            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-bold
                tracking-tight
                leading-tight
              "
            >
              Find. Fix. Understand
              <span className="text-red-400">.</span>
            </h1>

            <p
              className="
                text-gray-400
                mt-5
                text-base
                md:text-lg
                max-w-2xl
                leading-8
              "
            >
              Paste your buggy code and let your AI
              Coding Mentor detect errors, explain why
              they happen, and generate a corrected version.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {[
                "🔍 Detect Bugs",
                "🧠 Explain Errors",
                "🛠️ Generate Fix",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-white/[0.025]
                    border
                    border-white/5
                    text-xs
                    text-gray-500
                    hover:text-gray-300
                    hover:border-red-400/20
                    transition-all
                  "
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ================================================= */}
          {/* LANGUAGE */}
          {/* ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-end
              justify-between
              gap-4
              mb-5
            "
          >
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  tracking-wider
                  text-gray-500
                  uppercase
                  mb-2
                "
              >
                Programming Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="
                  bg-[#091321]
                  border
                  border-white/10
                  hover:border-red-400/30
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-red-400/60
                  focus:ring-2
                  focus:ring-red-400/10
                  transition-all
                  text-gray-200
                  min-w-[170px]
                  cursor-pointer
                "
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
                <option>C</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-red-400
                  animate-pulse
                "
              />
              Debug Engine Ready
            </div>
          </motion.div>

          {/* ================================================= */}
          {/* CODE EDITOR */}
          {/* ================================================= */}

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
              duration: 0.6,
              delay: 0.25,
            }}
            whileHover={{
              y: -3,
            }}
            className="
              relative
              group
              bg-[#091321]/90
              backdrop-blur-2xl
              border
              border-white/10
              hover:border-red-400/20
              rounded-2xl
              overflow-hidden
              shadow-2xl
              transition-colors
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-red-400/[0.018]
                via-transparent
                to-cyan-400/[0.018]
                pointer-events-none
              "
            />

            <div
              className="
                relative
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-white/10
                bg-white/[0.015]
              "
            >
              <div className="flex items-center gap-4">

                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>

                <span className="text-xs sm:text-sm text-gray-400 font-mono">
                  {language.toLowerCase()}-debug
                </span>
              </div>

              <div className="flex items-center gap-4">

                <span className="hidden sm:block text-xs text-gray-600 font-mono">
                  {code.length} chars
                </span>

                <span className="text-xs text-gray-600 font-mono">
                  {lineCount} lines
                </span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder={`// Paste your buggy ${language} code here...\n\n// Example:\n// let x = 10\n// console.log(y)`}
                spellCheck={false}
                className="
                  w-full
                  h-80
                  md:h-[430px]
                  bg-[#050b14]
                  p-5
                  md:p-7
                  pb-14
                  font-mono
                  text-sm
                  leading-7
                  text-gray-200
                  placeholder:text-gray-700
                  outline-none
                  resize-none
                  focus:ring-1
                  focus:ring-red-400/20
                  transition-all
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  flex
                  justify-between
                  items-center
                  px-5
                  py-3
                  bg-[#080f1c]/95
                  border-t
                  border-white/5
                "
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-600 font-mono">
                    UTF-8
                  </span>

                  <span className="text-xs text-gray-600">
                    {language}
                  </span>
                </div>

                <span className="text-xs text-gray-700">
                  Debugger Ready
                </span>
              </div>
            </div>

            {/* ACTION AREA */}

            <div
              className="
                relative
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
                p-5
                border-t
                border-white/5
              "
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🐛</span>

                <p className="text-xs text-gray-500">
                  Let AI find the problem and explain the fix.
                </p>
              </div>

              <div className="flex gap-3">

                {code && (
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={clearEditor}
                    className="
                      px-5
                      py-3
                      rounded-xl
                      border
                      border-white/10
                      hover:border-red-400/30
                      hover:text-red-400
                      text-gray-500
                      text-sm
                      font-semibold
                      transition-all
                    "
                  >
                    Clear
                  </motion.button>
                )}

                <motion.button
                  onClick={debugCode}
                  disabled={loading}
                  whileHover={{
                    scale: loading ? 1 : 1.04,
                    boxShadow: loading
                      ? "none"
                      : "0 0 30px rgba(248,113,113,0.14)",
                  }}
                  whileTap={{
                    scale: loading ? 1 : 0.97,
                  }}
                  className="
                    min-w-[190px]
                    flex
                    items-center
                    justify-center
                    bg-red-400
                    hover:bg-red-300
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    text-black
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    transition-all
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <motion.span
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="
                          w-4
                          h-4
                          border-2
                          border-black/30
                          border-t-black
                          rounded-full
                        "
                      />

                      AI Debugging...
                    </span>
                  ) : (
                    "🐛 Debug My Code"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ================================================= */}
          {/* PREMIUM LOADING */}
          {/* ================================================= */}

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="
                  relative
                  mt-6
                  overflow-hidden
                  bg-[#091321]/90
                  backdrop-blur-xl
                  border
                  border-red-400/20
                  rounded-2xl
                  p-6
                  shadow-2xl
                "
              >

                {/* Animated scanning beam */}

                <motion.div
                  animate={{
                    x: ["-100%", "220%"],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    top-0
                    left-0
                    w-1/2
                    h-[2px]
                    bg-gradient-to-r
                    from-transparent
                    via-red-400
                    to-transparent
                  "
                />

                <div className="flex items-center gap-4">

                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      rotate: [0, -8, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="
                      relative
                      w-12
                      h-12
                      rounded-2xl
                      bg-red-400/10
                      border
                      border-red-400/20
                      flex
                      items-center
                      justify-center
                      text-xl
                      shadow-[0_0_25px_rgba(248,113,113,0.08)]
                    "
                  >
                    🐛

                    <motion.div
                      animate={{
                        opacity: [0.2, 0.7, 0.2],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                      }}
                      className="
                        absolute
                        inset-0
                        rounded-2xl
                        border
                        border-red-400/20
                      "
                    />
                  </motion.div>

                  <div>
                    <p className="font-semibold text-gray-200">
                      AI is scanning your code...
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Checking syntax, logic and potential bugs
                    </p>
                  </div>

                  <div className="ml-auto flex gap-1.5">
                    {[0, 1, 2].map((item) => (
                      <motion.span
                        key={item}
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: item * 0.15,
                        }}
                        className="
                          w-2
                          h-2
                          rounded-full
                          bg-red-400
                        "
                      />
                    ))}
                  </div>
                </div>

                {/* Progress animation */}

                <div className="mt-5 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      h-full
                      w-1/2
                      bg-gradient-to-r
                      from-transparent
                      via-red-400
                      to-transparent
                    "
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================================================= */}
          {/* RESULTS */}
          {/* ================================================= */}

          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 35,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="mt-8"
              >

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <p className="text-xs text-red-400 font-bold tracking-widest">
                      DEBUG ANALYSIS
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                      AI Diagnosis
                    </h2>
                  </div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    className="
                      px-3
                      py-1.5
                      rounded-full
                      bg-emerald-400/10
                      border
                      border-emerald-400/10
                      text-emerald-400
                      text-xs
                      font-semibold
                    "
                  >
                    ✓ Analysis Complete
                  </motion.div>
                </div>

                {/* ERROR */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.1,
                  }}
                  className="
                    relative
                    overflow-hidden
                    bg-[#091321]/90
                    backdrop-blur-xl
                    border
                    border-red-400/20
                    rounded-2xl
                    p-6
                    shadow-xl
                  "
                >
                  <div className="flex items-center gap-3 mb-4">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-red-400/10
                        border
                        border-red-400/20
                        flex
                        items-center
                        justify-center
                      "
                    >
                      🚨
                    </div>

                    <div>
                      <h3 className="font-bold text-red-400">
                        Errors Detected
                      </h3>

                      <p className="text-xs text-gray-600">
                        Problems found in your code
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      whitespace-pre-wrap
                      text-gray-300
                      text-sm
                      leading-7
                    "
                  >
                    {result.errors || "No major errors found."}
                  </div>
                </motion.div>

                {/* WHY */}

                {result.why && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                    className="
                      mt-5
                      bg-[#091321]/90
                      backdrop-blur-xl
                      border
                      border-yellow-400/10
                      rounded-2xl
                      p-6
                    "
                  >
                    <div className="flex items-center gap-3 mb-4">

                      <div
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-yellow-400/10
                          border
                          border-yellow-400/10
                          flex
                          items-center
                          justify-center
                        "
                      >
                        🧠
                      </div>

                      <div>
                        <h3 className="font-bold text-yellow-400">
                          Why It Happens
                        </h3>

                        <p className="text-xs text-gray-600">
                          Understand the root cause
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        whitespace-pre-wrap
                        text-gray-300
                        text-sm
                        leading-7
                      "
                    >
                      {result.why}
                    </div>
                  </motion.div>
                )}

                {/* FIXED CODE */}

                {result.fixedCode && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    className="
                      mt-5
                      overflow-hidden
                      bg-[#091321]/95
                      backdrop-blur-xl
                      border
                      border-emerald-400/20
                      rounded-2xl
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-3
                        px-5
                        py-4
                        border-b
                        border-white/10
                      "
                    >
                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-emerald-400/10
                            border
                            border-emerald-400/20
                            flex
                            items-center
                            justify-center
                          "
                        >
                          🛠️
                        </div>

                        <div>
                          <h3 className="font-bold text-emerald-400">
                            Corrected Code
                          </h3>

                          <p className="text-xs text-gray-600">
                            AI-generated improved version
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{
                          scale: 1.04,
                        }}
                        whileTap={{
                          scale: 0.96,
                        }}
                        onClick={copyFixedCode}
                        className="
                          px-4
                          py-2
                          rounded-lg
                          border
                          border-white/10
                          hover:border-emerald-400/30
                          hover:text-emerald-400
                          text-xs
                          text-gray-500
                          transition-all
                        "
                      >
                        {copied
                          ? "✓ Copied"
                          : "Copy Fixed Code"}
                      </motion.button>
                    </div>

                    <pre
                      className="
                        overflow-x-auto
                        p-5
                        md:p-6
                        bg-[#050b14]
                        text-sm
                        leading-7
                        text-gray-300
                        font-mono
                      "
                    >
                      <code>{result.fixedCode}</code>
                    </pre>
                  </motion.div>
                )}

                {/* CONCEPT + TIP */}

                <div className="grid md:grid-cols-2 gap-5 mt-5">

                  {result.concept && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.4,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                      className="
                        bg-[#091321]/90
                        backdrop-blur-xl
                        border
                        border-purple-400/15
                        rounded-2xl
                        p-6
                      "
                    >
                      <div className="flex items-center gap-3 mb-4">

                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-purple-400/10
                            border
                            border-purple-400/10
                            flex
                            items-center
                            justify-center
                          "
                        >
                          📚
                        </div>

                        <h3 className="font-bold text-purple-400">
                          Important Concept
                        </h3>
                      </div>

                      <p
                        className="
                          text-sm
                          text-gray-300
                          leading-7
                          whitespace-pre-wrap
                        "
                      >
                        {result.concept}
                      </p>
                    </motion.div>
                  )}

                  {result.tip && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.5,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                      className="
                        bg-[#091321]/90
                        backdrop-blur-xl
                        border
                        border-cyan-400/15
                        rounded-2xl
                        p-6
                      "
                    >
                      <div className="flex items-center gap-3 mb-4">

                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-cyan-400/10
                            border
                            border-cyan-400/10
                            flex
                            items-center
                            justify-center
                          "
                        >
                          💡
                        </div>

                        <h3 className="font-bold text-cyan-400">
                          Mentor Tip
                        </h3>
                      </div>

                      <p
                        className="
                          text-sm
                          text-gray-300
                          leading-7
                          whitespace-pre-wrap
                        "
                      >
                        {result.tip}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================================================= */}
          {/* EMPTY STATE */}
          {/* ================================================= */}

          {!result && !loading && (
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
              }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-red-400/10
                    border
                    border-red-400/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  ✦
                </div>

                <div>
                  <p className="text-xs text-red-400 font-bold tracking-widest">
                    DEBUG WORKFLOW
                  </p>

                  <h2 className="text-lg font-bold mt-1">
                    How CodeMentor fixes bugs
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">

                {[
                  {
                    icon: "🔍",
                    title: "Detect",
                    text: "AI scans your code for syntax and logical problems.",
                  },
                  {
                    icon: "🧠",
                    title: "Explain",
                    text: "Understand exactly why the error is happening.",
                  },
                  {
                    icon: "🛠️",
                    title: "Fix",
                    text: "Get corrected code and learn how to avoid the mistake.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.45 + index * 0.1,
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                    }}
                    className="
                      group
                      relative
                      overflow-hidden
                      bg-[#091321]/70
                      backdrop-blur-xl
                      border
                      border-white/5
                      hover:border-red-400/20
                      rounded-2xl
                      p-5
                      transition-all
                    "
                  >
                    <div
                      className="
                        absolute
                        -right-8
                        -top-8
                        w-24
                        h-24
                        rounded-full
                        bg-red-400/5
                        blur-2xl
                      "
                    />

                    <div
                      className="
                        relative
                        w-11
                        h-11
                        rounded-xl
                        bg-white/[0.035]
                        border
                        border-white/5
                        flex
                        items-center
                        justify-center
                        text-xl
                        group-hover:scale-110
                        transition-transform
                      "
                    >
                      {item.icon}
                    </div>

                    <h3
                      className="
                        text-sm
                        font-bold
                        mt-5
                        group-hover:text-red-400
                        transition-colors
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-600
                        leading-6
                        mt-2
                      "
                    >
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="h-10" />
        </div>
      </section>
    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function ExplainCode() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [result, setResult] = useState("");
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

    if (lastActiveDate === today) {
      return;
    }

    if (lastActiveDate === yesterday.toDateString()) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem("streak", String(currentStreak));
    localStorage.setItem("lastActiveDate", today);
  };

  const explainCode = async () => {
    if (!code.trim()) {
      alert("Please paste your code first!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          action: "explain",
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to explain code"
        );
      }

      setResult(data.result);

      const count =
        Number(
          localStorage.getItem("explainCount") || "0"
        ) + 1;

      localStorage.setItem(
        "explainCount",
        String(count)
      );

      localStorage.setItem(
        "lastActivity",
        `Explained ${language} code with AI`
      );

      localStorage.setItem(
        "lastActivityTime",
        new Date().toLocaleString()
      );

      updateStreak();

      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      setResult(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy the explanation.");
    }
  };

  const lineCount = code
    ? code.split("\n").length
    : 0;

  return (
    <main className="min-h-screen bg-[#050b14] text-white overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-40
            -left-40
            w-[500px]
            h-[500px]
            bg-cyan-500/10
            blur-[130px]
            rounded-full
          "
        />

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-1/3
            -right-40
            w-[500px]
            h-[500px]
            bg-blue-500/10
            blur-[140px]
            rounded-full
          "
        />

        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-20
            left-[8%]
            text-7xl
            font-bold
            text-cyan-400/[0.035]
          "
        >
          {"{}"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-28
            right-[10%]
            text-7xl
            font-bold
            text-cyan-300/[0.035]
          "
        >
          {"</>"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, -18, 0],
            x: [0, 12, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-[48%]
            left-[8%]
            text-6xl
            font-bold
            text-blue-400/[0.035]
          "
        >
          AI
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, 6, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-20
            right-[12%]
            text-7xl
            font-bold
            text-cyan-400/[0.035]
          "
        >
          01
        </motion.div>

      </div>

      {/* ================= NAVIGATION ================= */}

      <Sidebar />
      <MobileNav />

      {/* ================= MAIN ================= */}

      <motion.section
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
        className="
          relative
          z-10
          min-h-screen
          pt-[100px]
          p-6
          md:p-10
          md:pt-10
          md:ml-64
        "
      >

        <div className="max-w-5xl mx-auto">

          {/* ================= BACK ================= */}

          <Link
            href="/dashboard"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-gray-500
              hover:text-cyan-400
              transition-colors
            "
          >
            ← Back to Dashboard
          </Link>

          {/* ================= HEADER ================= */}

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
              duration: 0.5,
              delay: 0.1,
            }}
            className="mt-7 mb-10"
          >

            <div className="flex items-center gap-3 mb-3 flex-wrap">

              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-cyan-400/10
                  border
                  border-cyan-400/20
                  text-cyan-400
                  text-xs
                  font-semibold
                  tracking-wider
                "
              >
                AI CODE EXPLAINER
              </span>

              <span className="flex items-center gap-1.5 text-xs text-emerald-400">

                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />

                AI Online

              </span>

            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">

              Understand Your Code
              <span className="text-cyan-400">.</span>

            </h1>

            <p
              className="
                text-gray-400
                mt-4
                text-base
                md:text-lg
                max-w-2xl
                leading-relaxed
              "
            >
              Paste your code and let your AI Coding Mentor
              break it down into simple, beginner-friendly
              explanations.
            </p>

          </motion.div>

          {/* ================= LANGUAGE ================= */}

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
              duration: 0.5,
              delay: 0.15,
            }}
            className="mb-5"
          >

            <label className="block text-sm font-medium text-gray-400 mb-2">
              Programming Language
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              disabled={loading}
              className="
                bg-[#0a1423]
                border
                border-white/10
                hover:border-white/20
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-cyan-400/60
                focus:ring-2
                focus:ring-cyan-400/10
                transition-all
                text-gray-200
                disabled:opacity-50
              "
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>Java</option>
              <option>C++</option>
              <option>C</option>
            </select>

          </motion.div>

          {/* ================= CODE EDITOR ================= */}

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
              duration: 0.5,
              delay: 0.2,
            }}
            whileHover={{
              y: -2,
            }}
            className="
              relative
              bg-[#091321]/90
              backdrop-blur-xl
              border
              border-white/10
              rounded-2xl
              overflow-hidden
              shadow-2xl
            "
          >

            {/* Animated border glow */}

            <motion.div
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                inset-0
                rounded-2xl
                border
                border-cyan-400/20
                pointer-events-none
              "
            />

            {/* Editor Header */}

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
              "
            >

              <div className="flex items-center gap-3">

                <div className="flex gap-1.5">

                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />

                </div>

                <span className="text-sm text-gray-400">
                  {language.toLowerCase()}-code
                </span>

              </div>

              <span className="text-xs text-gray-600 font-mono">
                {code.length} chars • {lineCount} lines
              </span>

            </div>

            {/* Editor */}

            <div className="relative">

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder={`// Paste your ${language} code here...`}
                spellCheck={false}
                disabled={loading}
                className="
                  w-full
                  h-80
                  md:h-96
                  bg-[#050b14]
                  p-5
                  md:p-6
                  pb-12
                  font-mono
                  text-sm
                  leading-7
                  text-gray-200
                  placeholder:text-gray-700
                  outline-none
                  resize-none
                  focus:ring-1
                  focus:ring-cyan-400/20
                  disabled:opacity-60
                "
              />

              {/* Editor Status */}

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
                  py-2.5
                  bg-[#080f1c]/95
                  border-t
                  border-white/5
                "
              >

                <span className="text-xs text-gray-600 font-mono">
                  UTF-8
                </span>

                <span className="text-xs text-gray-600">
                  {language}
                </span>

              </div>

            </div>

            {/* Action Area */}

            <div
              className="
                flex
                justify-between
                items-center
                p-5
                gap-4
                flex-wrap
              "
            >

              <p className="text-xs text-gray-500">
                💡 Tip: Add comments to your code for better explanations.
              </p>

              <motion.button
                onClick={explainCode}
                disabled={loading}
                whileHover={{
                  scale: loading ? 1 : 1.03,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.97,
                }}
                className="
                  min-w-[190px]
                  bg-cyan-400
                  hover:bg-cyan-300
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-black
                  px-6
                  py-3
                  rounded-xl
                  font-bold
                  transition-all
                  shadow-lg
                  shadow-cyan-400/20
                "
              >

                {loading ? (

                  <span className="flex items-center justify-center gap-2">

                    <motion.span
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-xl leading-none"
                    >
                      ◌
                    </motion.span>

                    AI Analyzing...

                  </span>

                ) : (

                  <span className="flex items-center justify-center gap-2">
                    ✨ Explain My Code
                  </span>

                )}

              </motion.button>

            </div>

          </motion.div>

          {/* ================= AI LOADING ================= */}

          <AnimatePresence>
            {loading && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="
                  mt-6
                  relative
                  overflow-hidden
                  bg-[#091321]/90
                  backdrop-blur-xl
                  border
                  border-cyan-400/20
                  rounded-2xl
                  p-6
                  shadow-2xl
                "
              >

                {/* Moving top light */}

                <motion.div
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
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
                    via-cyan-400
                    to-transparent
                  "
                />

                <div className="flex items-center gap-4">

                  {/* AI Orb */}

                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-cyan-400/10
                      border
                      border-cyan-400/30
                      flex
                      items-center
                      justify-center
                      text-2xl
                      shadow-lg
                      shadow-cyan-400/10
                    "
                  >
                    🤖
                  </motion.div>

                  <div>

                    <p className="font-semibold text-gray-200">
                      AI is analyzing...
                    </p>

                    <motion.p
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="text-sm text-gray-500 mt-1"
                    >
                      Understanding logic, syntax and concepts
                    </motion.p>

                  </div>

                  {/* Dots */}

                  <div className="ml-auto flex gap-1.5">

                    {[0, 1, 2].map((i) => (

                      <motion.span
                        key={i}
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="
                          w-2
                          h-2
                          rounded-full
                          bg-cyan-400
                        "
                      />

                    ))}

                  </div>

                </div>

                {/* Progress Line */}

                <div className="mt-5 h-1 bg-white/5 rounded-full overflow-hidden">

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
                      bg-cyan-400
                      rounded-full
                    "
                  />

                </div>

              </motion.div>

            )}
          </AnimatePresence>

          {/* ================= RESULT ================= */}

          <AnimatePresence mode="wait">

            {result && !loading && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.96,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.98,
                  filter: "blur(5px)",
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-8
                  relative
                  overflow-hidden
                  bg-[#091321]/90
                  backdrop-blur-xl
                  border
                  border-cyan-400/20
                  rounded-2xl
                  shadow-2xl
                "
              >

                {/* Result Light Sweep */}

                <motion.div
                  initial={{
                    x: "-100%",
                  }}
                  animate={{
                    x: "100%",
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                  className="
                    absolute
                    top-0
                    left-0
                    w-full
                    h-[2px]
                    bg-gradient-to-r
                    from-transparent
                    via-cyan-400
                    to-transparent
                  "
                />

                {/* Result Header */}

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    px-5
                    md:px-6
                    py-4
                    border-b
                    border-white/10
                  "
                >

                  <div className="flex items-center gap-3">

                    <motion.div
                      initial={{
                        scale: 0.5,
                        rotate: -20,
                      }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-cyan-400/10
                        flex
                        items-center
                        justify-center
                      "
                    >
                      🤖
                    </motion.div>

                    <div>

                      <h2 className="font-bold text-cyan-400">
                        AI Explanation
                      </h2>

                      <p className="text-xs text-gray-600">
                        Generated by CodeMentor AI
                      </p>

                    </div>

                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={copyResult}
                    className="
                      text-xs
                      border
                      border-white/10
                      hover:border-cyan-400/30
                      hover:text-cyan-400
                      px-3
                      py-2
                      rounded-lg
                      transition-all
                    "
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </motion.button>

                </div>

                {/* Result Content */}

                <div className="p-6 md:p-8">

                  {result.startsWith("Error:") ? (

                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      className="
                        text-red-400
                        bg-red-400/5
                        border
                        border-red-400/10
                        rounded-xl
                        p-4
                      "
                    >
                      {result}
                    </motion.div>

                  ) : (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15,
                      }}
                      className="
                        whitespace-pre-wrap
                        text-gray-300
                        leading-8
                        text-[15px]
                      "
                    >
                      {result}
                    </motion.div>

                  )}

                </div>

                {/* Result Footer */}

                <div
                  className="
                    px-6
                    py-3
                    border-t
                    border-white/5
                    text-xs
                    text-gray-600
                  "
                >
                  💡 Read through the explanation and try modifying
                  the code yourself.

                </div>

              </motion.div>

            )}

          </AnimatePresence>

          {/* ================= EMPTY STATE ================= */}

          {!result && !loading && (

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
                duration: 0.5,
                delay: 0.3,
              }}
              className="mt-8 grid md:grid-cols-3 gap-4"
            >

              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="
                  bg-white/[0.025]
                  border
                  border-white/5
                  hover:border-cyan-400/20
                  rounded-xl
                  p-4
                  transition-all
                "
              >
                <p className="text-sm font-semibold text-gray-300">
                  💡 Understand
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Learn what each part of your code does.
                </p>

              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="
                  bg-white/[0.025]
                  border
                  border-white/5
                  hover:border-cyan-400/20
                  rounded-xl
                  p-4
                  transition-all
                "
              >
                <p className="text-sm font-semibold text-gray-300">
                  🧠 Learn
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Discover the programming concepts behind it.
                </p>

              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="
                  bg-white/[0.025]
                  border
                  border-white/5
                  hover:border-cyan-400/20
                  rounded-xl
                  p-4
                  transition-all
                "
              >

                <p className="text-sm font-semibold text-gray-300">
                  🚀 Improve
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Use the explanation to write better code.
                </p>

              </motion.div>

            </motion.div>

          )}

        </div>

      </motion.section>

    </main>
  );
}
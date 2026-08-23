"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

type Problem = {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium";
  concept: string;
  examples: string[];
};

type Result = {
  verdict: string;
  feedback: string;
  errors: string;
  suggestions: string;
  score: string;
};

const problems: Problem[] = [
  {
    id: 1,
    title: "Check Even or Odd",
    description:
      "Write a program that checks whether a given number is even or odd.",
    difficulty: "Easy",
    concept: "Conditional Statements",
    examples: [
      "Input: 8 → Output: Even",
      "Input: 7 → Output: Odd",
    ],
  },
  {
    id: 2,
    title: "Find Largest Number",
    description:
      "Write a program to find the largest number among three given numbers.",
    difficulty: "Easy",
    concept: "Conditions & Comparison",
    examples: [
      "Input: 10, 25, 15 → Output: 25",
      "Input: 8, 4, 6 → Output: 8",
    ],
  },
  {
    id: 3,
    title: "Reverse a String",
    description:
      "Write a program that reverses a given string.",
    difficulty: "Easy",
    concept: "Strings",
    examples: [
      'Input: "hello" → Output: "olleh"',
      'Input: "code" → Output: "edoc"',
    ],
  },
  {
    id: 4,
    title: "Check Prime Number",
    description:
      "Write a program to determine whether a given number is prime.",
    difficulty: "Medium",
    concept: "Loops & Conditions",
    examples: [
      "Input: 7 → Output: Prime",
      "Input: 10 → Output: Not Prime",
    ],
  },
  {
    id: 5,
    title: "Find Duplicate Elements",
    description:
      "Write a program to find duplicate elements in an array.",
    difficulty: "Medium",
    concept: "Arrays & Data Structures",
    examples: [
      "Input: [1,2,3,2] → Output: 2",
      "Input: [4,5,6,4,5] → Output: 4, 5",
    ],
  },
];

export default function Practice() {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showProblems, setShowProblems] = useState(false);

  const updateStreak = () => {
    const today = new Date().toDateString();

    const lastActiveDate =
      localStorage.getItem("lastActiveDate");

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

    localStorage.setItem(
      "streak",
      String(currentStreak)
    );

    localStorage.setItem(
      "lastActiveDate",
      today
    );
  };

  const parseResult = (text: string): Result => {
    const getSection = (
      start: string,
      end?: string
    ) => {
      const startIndex = text
        .toUpperCase()
        .indexOf(start);

      if (startIndex === -1) return "";

      const contentStart =
        startIndex + start.length;

      const endIndex = end
        ? text
            .toUpperCase()
            .indexOf(end, contentStart)
        : -1;

      return text
        .slice(
          contentStart,
          endIndex === -1 || !end
            ? undefined
            : endIndex
        )
        .trim();
    };

    return {
      verdict:
        getSection("VERDICT:", "FEEDBACK:") ||
        "Not Available",

      feedback:
        getSection("FEEDBACK:", "ERRORS:") ||
        "",

      errors:
        getSection("ERRORS:", "SUGGESTIONS:") ||
        "",

      suggestions:
        getSection(
          "SUGGESTIONS:",
          "SCORE:"
        ) || "",

      score:
        getSection("SCORE:") ||
        "",
    };
  };

  const submitSolution = async () => {
    if (!code.trim()) {
      alert("Please write your solution first!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          action: "check-solution",
          language,
          code,
          problem: selectedProblem.title,
          description: selectedProblem.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to check solution"
        );
      }

      const parsed = parseResult(data.result);

      setResult(parsed);

      const solved =
        Number(
          localStorage.getItem("problemsSolved") ||
            "0"
        ) + 1;

      localStorage.setItem(
        "problemsSolved",
        String(solved)
      );

      localStorage.setItem(
        "lastActivity",
        `Practiced ${selectedProblem.title}`
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
        verdict: "ERROR",
        feedback:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        errors: "",
        suggestions:
          "Please check your API configuration and try again.",
        score: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyFeedback = async () => {
    if (!result) return;

    const text = `
VERDICT:
${result.verdict}

FEEDBACK:
${result.feedback}

ERRORS:
${result.errors}

SUGGESTIONS:
${result.suggestions}

SCORE:
${result.score}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy feedback.");
    }
  };

  const clearCode = () => {
    setCode("");
    setResult(null);
  };

  const selectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setCode("");
    setResult(null);
    setShowProblems(false);
  };

  return (
    <main className="min-h-screen bg-[#050b14] text-white overflow-hidden">

      {/* ================================================= */}
      {/* ANIMATED BACKGROUND */}
      {/* ================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

        <motion.div
          animate={{
            x: [0, 40, 0],
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
            x: [0, -40, 0],
            y: [0, 30, 0],
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
            bg-blue-500/[0.06]
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
            bg-cyan-400/[0.04]
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
            text-cyan-400/[0.04]
          "
        >
          {"</>"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, 25, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-40
            right-[8%]
            text-6xl
            font-bold
            text-blue-400/[0.04]
          "
        >
          {"{ }"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-28
            left-[7%]
            text-6xl
            font-bold
            text-cyan-400/[0.035]
          "
        >
          CODE
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
              <span className="text-lg">
                ←
              </span>

              Back to Dashboard
            </Link>
          </motion.div>

          {/* HEADER */}

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
                  bg-cyan-400/10
                  border
                  border-cyan-400/20
                  text-cyan-400
                  text-xs
                  font-bold
                  tracking-widest
                "
              >
                AI PRACTICE LAB
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
              Practice. Code.{" "}
              <span className="text-cyan-400">
                Improve.
              </span>
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
              Solve coding problems and let your AI
              Coding Mentor review your solution,
              identify mistakes, and guide you toward
              better code.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">

              {[
                "🧠 Build Logic",
                "⚡ Practice Coding",
                "🤖 Get AI Feedback",
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
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-white/[0.025]
                    border
                    border-white/5
                    text-xs
                    text-gray-500
                  "
                >
                  {item}
                </motion.div>
              ))}

            </div>

          </motion.div>

          {/* ================================================= */}
          {/* PROBLEM SELECTOR */}
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
            className="mb-6"
          >

            <div className="flex items-center justify-between mb-3">

              <label
                className="
                  text-xs
                  font-bold
                  tracking-wider
                  text-gray-500
                  uppercase
                "
              >
                Current Challenge
              </label>

              <span className="text-xs text-gray-600">
                {problems.length} problems available
              </span>

            </div>

            <div
              className="
                bg-[#091321]/90
                backdrop-blur-xl
                border
                border-white/10
                rounded-2xl
                overflow-hidden
              "
            >

              <button
                onClick={() =>
                  setShowProblems(!showProblems)
                }
                className="
                  w-full
                  p-5
                  flex
                  items-center
                  justify-between
                  text-left
                  hover:bg-white/[0.02]
                  transition-all
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-cyan-400/10
                      border
                      border-cyan-400/15
                      flex
                      items-center
                      justify-center
                      text-xl
                    "
                  >
                    🧠
                  </div>

                  <div>

                    <div className="flex items-center gap-3">

                      <h2 className="font-bold text-gray-200">
                        {selectedProblem.title}
                      </h2>

                      <span
                        className={`
                          text-[10px]
                          px-2
                          py-1
                          rounded-full
                          font-bold
                          ${
                            selectedProblem.difficulty ===
                            "Easy"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-yellow-400/10 text-yellow-400"
                          }
                        `}
                      >
                        {selectedProblem.difficulty}
                      </span>

                    </div>

                    <p className="text-xs text-gray-600 mt-1">
                      {selectedProblem.concept}
                    </p>

                  </div>

                </div>

                <span
                  className={`text-gray-500 transition-transform ${
                    showProblems
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ▼
                </span>

              </button>

              <AnimatePresence>

                {showProblems && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="border-t border-white/5"
                  >

                    <div className="p-3 grid sm:grid-cols-2 gap-2">

                      {problems.map((problem) => (
                        <button
                          key={problem.id}
                          onClick={() =>
                            selectProblem(problem)
                          }
                          className={`
                            text-left
                            p-4
                            rounded-xl
                            border
                            transition-all
                            ${
                              selectedProblem.id ===
                              problem.id
                                ? "bg-cyan-400/[0.06] border-cyan-400/20"
                                : "bg-white/[0.015] border-white/5 hover:border-cyan-400/15"
                            }
                          `}
                        >

                          <div className="flex items-center justify-between">

                            <span
                              className={`
                                text-sm
                                font-semibold
                                ${
                                  selectedProblem.id ===
                                  problem.id
                                    ? "text-cyan-400"
                                    : "text-gray-300"
                                }
                              `}
                            >
                              {problem.id}.{" "}
                              {problem.title}
                            </span>

                            <span
                              className={`
                                text-[9px]
                                px-2
                                py-1
                                rounded-full
                                ${
                                  problem.difficulty ===
                                  "Easy"
                                    ? "text-emerald-400 bg-emerald-400/10"
                                    : "text-yellow-400 bg-yellow-400/10"
                                }
                              `}
                            >
                              {problem.difficulty}
                            </span>

                          </div>

                          <p className="text-xs text-gray-600 mt-2 leading-5">
                            {problem.description}
                          </p>

                        </button>
                      ))}

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

          </motion.div>

          {/* ================================================= */}
          {/* PROBLEM DESCRIPTION */}
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
              delay: 0.25,
            }}
            className="
              bg-[#091321]/90
              backdrop-blur-xl
              border
              border-white/10
              rounded-2xl
              p-6
              mb-5
            "
          >

            <div className="flex items-start gap-4">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-400/10
                  border
                  border-blue-400/15
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                📋
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between gap-3 flex-wrap">

                  <h2 className="text-lg font-bold">
                    Problem Statement
                  </h2>

                  <span className="text-xs text-gray-600">
                    Concept:{" "}
                    <span className="text-cyan-400">
                      {selectedProblem.concept}
                    </span>
                  </span>

                </div>

                <p className="text-sm text-gray-400 leading-7 mt-3">
                  {selectedProblem.description}
                </p>

                <div className="mt-4 space-y-2">

                  {selectedProblem.examples.map(
                    (example) => (
                      <div
                        key={example}
                        className="
                          px-4
                          py-2.5
                          rounded-lg
                          bg-[#050b14]
                          border
                          border-white/5
                          text-xs
                          text-gray-500
                          font-mono
                        "
                      >
                        {example}
                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </motion.div>

          {/* ================================================= */}
          {/* LANGUAGE */}
          {/* ================================================= */}

          <div className="mb-5">

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
                hover:border-cyan-400/30
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-cyan-400/60
                focus:ring-2
                focus:ring-cyan-400/10
                transition-all
                text-gray-200
                min-w-[180px]
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
              delay: 0.3,
            }}
            whileHover={{
              y: -3,
            }}
            className="
              bg-[#091321]/90
              backdrop-blur-2xl
              border
              border-white/10
              hover:border-cyan-400/20
              rounded-2xl
              overflow-hidden
              shadow-2xl
            "
          >

            {/* Editor Header */}

            <div
              className="
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
                  {language.toLowerCase()}-practice
                </span>

              </div>

              <div className="flex items-center gap-4">

                <span className="hidden sm:block text-xs text-gray-600 font-mono">
                  {code.length} chars
                </span>

                <span className="text-xs text-gray-600 font-mono">
                  {code
                    ? code.split("\n").length
                    : 0}{" "}
                  lines
                </span>

              </div>

            </div>

            {/* Textarea */}

            <div className="relative">

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                spellCheck={false}
                placeholder={`// Write your ${language} solution here...\n\n// Example:\n// number = 10\n// if number % 2 == 0:\n//     print("Even")`}
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
                  focus:ring-cyan-400/20
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
                  Practice Mode
                </span>

              </div>

            </div>

            {/* Actions */}

            <div
              className="
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

                <span>💡</span>

                <p className="text-xs text-gray-500">
                  Try solving it yourself before asking AI
                  for feedback.
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
                    onClick={clearCode}
                    className="
                      px-5
                      py-3
                      rounded-xl
                      border
                      border-white/10
                      hover:border-cyan-400/30
                      hover:text-cyan-400
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
                  onClick={submitSolution}
                  disabled={loading}
                  whileHover={{
                    scale: loading ? 1 : 1.04,
                    boxShadow: loading
                      ? "none"
                      : "0 0 30px rgba(34,211,238,0.15)",
                  }}
                  whileTap={{
                    scale: loading ? 1 : 0.97,
                  }}
                  className="
                    bg-cyan-400
                    hover:bg-cyan-300
                    disabled:opacity-50
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
                    <span className="flex items-center gap-2">

                      <span
                        className="
                          w-4
                          h-4
                          border-2
                          border-black/30
                          border-t-black
                          rounded-full
                          animate-spin
                        "
                      />

                      AI Reviewing...

                    </span>
                  ) : (
                    "🚀 Check My Solution"
                  )}

                </motion.button>

              </div>

            </div>

          </motion.div>

          {/* ================================================= */}
          {/* AI LOADING */}
          {/* ================================================= */}

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
                }}
                className="
                  relative
                  mt-6
                  overflow-hidden
                  bg-cyan-400/[0.035]
                  backdrop-blur-xl
                  border
                  border-cyan-400/15
                  rounded-2xl
                  p-6
                "
              >

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
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-cyan-400
                    to-transparent
                  "
                />

                <div className="flex items-center gap-4">

                  <motion.div
                    animate={{
                      rotate: [0, 8, -8, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-cyan-400/10
                      border
                      border-cyan-400/20
                      flex
                      items-center
                      justify-center
                      text-xl
                    "
                  >
                    🤖
                  </motion.div>

                  <div>

                    <p className="font-semibold text-gray-200">
                      AI is reviewing your solution...
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Checking logic, correctness and code quality
                    </p>

                  </div>

                  <div className="ml-auto flex gap-1">

                    {[0, 1, 2].map((item) => (
                      <motion.span
                        key={item}
                        animate={{
                          y: [0, -5, 0],
                          opacity: [0.4, 1, 0.4],
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
                          bg-cyan-400
                        "
                      />
                    ))}

                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

          {/* ================================================= */}
          {/* RESULT */}
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
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="mt-8"
              >

                {/* Result Header */}

                <div className="flex items-center justify-between mb-5 gap-4">

                  <div>

                    <p className="text-xs text-cyan-400 font-bold tracking-widest">
                      PRACTICE ANALYSIS
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                      AI Code Review
                    </h2>

                  </div>

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        hidden
                        sm:block
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
                      ✓ Review Complete
                    </div>

                    <motion.button
                      whileHover={{
                        scale: 1.04,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      onClick={copyFeedback}
                      className="
                        px-3
                        py-2
                        rounded-lg
                        border
                        border-white/10
                        hover:border-cyan-400/30
                        hover:text-cyan-400
                        text-xs
                        text-gray-500
                        transition-all
                      "
                    >
                      {copied
                        ? "✓ Copied"
                        : "Copy"}
                    </motion.button>

                  </div>

                </div>

                {/* Verdict */}

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
                    bg-[#091321]/90
                    backdrop-blur-xl
                    border
                    border-cyan-400/15
                    rounded-2xl
                    p-6
                    shadow-xl
                  "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-cyan-400/10
                        border
                        border-cyan-400/20
                        flex
                        items-center
                        justify-center
                        text-xl
                      "
                    >
                      {result.verdict
                        .toLowerCase()
                        .includes("pass") ||
                      result.verdict
                        .toLowerCase()
                        .includes("correct")
                        ? "✓"
                        : "⚡"}
                    </div>

                    <div>

                      <p className="text-xs text-gray-600 uppercase tracking-wider">
                        Verdict
                      </p>

                      <h3 className="text-xl font-bold text-cyan-400 mt-1">
                        {result.verdict}
                      </h3>

                    </div>

                  </div>

                </motion.div>

                {/* Feedback + Errors */}

                <div className="grid md:grid-cols-2 gap-5 mt-5">

                  {result.feedback && (
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
                        bg-[#091321]/90
                        backdrop-blur-xl
                        border
                        border-blue-400/15
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
                            bg-blue-400/10
                            border
                            border-blue-400/10
                            flex
                            items-center
                            justify-center
                          "
                        >
                          🧠
                        </div>

                        <h3 className="font-bold text-blue-400">
                          AI Feedback
                        </h3>

                      </div>

                      <p className="
                        text-sm
                        text-gray-300
                        leading-7
                        whitespace-pre-wrap
                      ">
                        {result.feedback}
                      </p>

                    </motion.div>
                  )}

                  {result.errors && (
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
                        bg-[#091321]/90
                        backdrop-blur-xl
                        border
                        border-red-400/15
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
                            bg-red-400/10
                            border
                            border-red-400/10
                            flex
                            items-center
                            justify-center
                          "
                        >
                          🚨
                        </div>

                        <h3 className="font-bold text-red-400">
                          Errors
                        </h3>

                      </div>

                      <p className="
                        text-sm
                        text-gray-300
                        leading-7
                        whitespace-pre-wrap
                      ">
                        {result.errors}
                      </p>

                    </motion.div>
                  )}

                </div>

                {/* Suggestions */}

                {result.suggestions && (
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
                    className="
                      mt-5
                      bg-[#091321]/90
                      backdrop-blur-xl
                      border
                      border-emerald-400/15
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
                          bg-emerald-400/10
                          border
                          border-emerald-400/10
                          flex
                          items-center
                          justify-center
                        "
                      >
                        🚀
                      </div>

                      <div>

                        <h3 className="font-bold text-emerald-400">
                          Improvement Suggestions
                        </h3>

                        <p className="text-xs text-gray-600">
                          How you can make your solution better
                        </p>

                      </div>

                    </div>

                    <p className="
                      text-sm
                      text-gray-300
                      leading-7
                      whitespace-pre-wrap
                    ">
                      {result.suggestions}
                    </p>

                  </motion.div>
                )}

                {/* Score */}

                {result.score && (
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
                    className="
                      mt-5
                      bg-[#091321]/90
                      backdrop-blur-xl
                      border
                      border-cyan-400/15
                      rounded-2xl
                      p-6
                    "
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-xs text-gray-600 uppercase tracking-wider">
                          Performance Score
                        </p>

                        <h3 className="text-3xl font-bold text-cyan-400 mt-1">
                          {result.score}
                        </h3>

                      </div>

                      <div className="text-4xl">
                        🏆
                      </div>

                    </div>

                  </motion.div>
                )}

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
                    bg-cyan-400/10
                    border
                    border-cyan-400/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  ✦
                </div>

                <div>

                  <p className="text-xs text-cyan-400 font-bold tracking-widest">
                    LEARNING WORKFLOW
                  </p>

                  <h2 className="text-lg font-bold mt-1">
                    How CodeMentor helps you practice
                  </h2>

                </div>

              </div>

              <div className="grid md:grid-cols-3 gap-4">

                {[
                  {
                    icon: "💻",
                    title: "Solve",
                    text: "Write your own solution and build problem-solving skills.",
                  },
                  {
                    icon: "🤖",
                    title: "Review",
                    text: "AI analyzes your code and identifies correctness issues.",
                  },
                  {
                    icon: "🚀",
                    title: "Improve",
                    text: "Learn from feedback and make your coding stronger.",
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
                      delay:
                        0.45 + index * 0.1,
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
                      hover:border-cyan-400/20
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
                        bg-cyan-400/5
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
                        group-hover:text-cyan-400
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
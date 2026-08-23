"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function MentorChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const updateStreak = () => {
    const today = new Date().toDateString();

    const lastActiveDate =
      localStorage.getItem("lastActiveDate");

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

    localStorage.setItem(
      "streak",
      String(currentStreak)
    );

    localStorage.setItem(
      "lastActiveDate",
      today
    );
  };

  const askMentor = async (customQuestion?: string) => {
    const finalQuestion = (
      customQuestion ?? question
    ).trim();

    if (!finalQuestion || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: finalQuestion,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          action: "chat",
          question: finalQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get AI response"
        );
      }

      const aiResponse =
        typeof data.result === "string"
          ? data.result
          : "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ]);

      const count =
        Number(
          localStorage.getItem("mentorChatCount") ||
            "0"
        ) + 1;

      localStorage.setItem(
        "mentorChatCount",
        String(count)
      );

      localStorage.setItem(
        "lastActivity",
        "Asked AI Coding Mentor a question"
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : "Error: Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleSubmit = () => {
    askMentor();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askMentor();
    }
  };

  const copyMessage = async (
    content: string,
    index: number
  ) => {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch {
      alert("Failed to copy message.");
    }
  };

  const clearChat = () => {
    setMessages([]);
    setQuestion("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const suggestions = [
    {
      icon: "🧠",
      title: "Explain a concept",
      text: "Explain recursion in simple words",
    },
    {
      icon: "💻",
      title: "Learn programming",
      text: "What is the difference between let, const and var?",
    },
    {
      icon: "🐛",
      title: "Solve a problem",
      text: "Why do I get undefined in JavaScript?",
    },
    {
      icon: "🚀",
      title: "Improve my skills",
      text: "Give me a roadmap to become a frontend developer",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050b14] text-white overflow-hidden">

      {/* ================================================= */}
      {/* ANIMATED BACKGROUND */}
      {/* ================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 11,
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
            duration: 13,
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
            y: [0, -15, 0],
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
            bg-cyan-400/[0.045]
            blur-[140px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Floating symbols */}

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
            text-cyan-400/[0.035]
          "
        >
          {"{ }"}
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
            top-32
            right-[8%]
            text-6xl
            font-bold
            text-blue-400/[0.04]
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
            text-cyan-400/[0.035]
          "
        >
          AI
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
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
            text-cyan-400/[0.04]
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
      {/* MAIN */}
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

        <div className="max-w-5xl mx-auto">

          {/* ================================================= */}
          {/* BACK */}
          {/* ================================================= */}

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
            className="mt-8 mb-8"
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
                AI MENTOR
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
              Ask Your Coding Mentor
              <span className="text-cyan-400">
                .
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
              Stuck on a programming concept?
              Ask anything and get a clear,
              beginner-friendly explanation from
              your AI Coding Mentor.
            </p>

            {/* Feature pills */}

            <div className="flex flex-wrap gap-3 mt-6">

              {[
                "🧠 Learn Concepts",
                "💻 Understand Code",
                "🚀 Improve Skills",
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
                    delay: 0.25 + index * 0.1,
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
          {/* CHAT CONTAINER */}
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
              delay: 0.2,
            }}
            className="
              relative
              overflow-hidden
              bg-[#091321]/90
              backdrop-blur-2xl
              border
              border-white/10
              rounded-2xl
              shadow-2xl
            "
          >

            {/* Top glow */}

            <div
              className="
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-cyan-400/60
                to-transparent
              "
            />

            {/* ================================================= */}
            {/* CHAT HEADER */}
            {/* ================================================= */}

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

              <div className="flex items-center gap-3">

                <motion.div
                  animate={{
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="
                    w-11
                    h-11
                    rounded-xl
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

                  <h2 className="font-bold text-gray-200">
                    CodeMentor AI
                  </h2>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mt-1
                    "
                  >
                    <span
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-emerald-400
                        animate-pulse
                      "
                    />

                    <span className="text-xs text-gray-600">
                      Ready to help you learn
                    </span>
                  </div>

                </div>

              </div>

              {messages.length > 0 && (
                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={clearChat}
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
                  Clear Chat
                </motion.button>
              )}

            </div>

            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            <div
              className="
                min-h-[430px]
                max-h-[600px]
                overflow-y-auto
                p-5
                md:p-7
                space-y-5
              "
            >

              {/* Empty State */}

              {messages.length === 0 && !loading && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                    min-h-[370px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >

                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      w-20
                      h-20
                      rounded-3xl
                      bg-cyan-400/[0.07]
                      border
                      border-cyan-400/15
                      flex
                      items-center
                      justify-center
                      text-4xl
                      mb-6
                    "
                  >
                    🤖
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-200">
                    What would you like to learn?
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 max-w-md">
                    Ask me about programming,
                    debugging, web development,
                    data structures, algorithms,
                    or any coding concept.
                  </p>

                  {/* Suggestions */}

                  <div className="grid sm:grid-cols-2 gap-3 mt-7 w-full max-w-2xl">

                    {suggestions.map((item, index) => (
                      <motion.button
                        key={item.title}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.1 + index * 0.08,
                        }}
                        whileHover={{
                          y: -3,
                          borderColor:
                            "rgba(34,211,238,0.2)",
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          askMentor(item.text)
                        }
                        className="
                          text-left
                          p-4
                          rounded-xl
                          bg-white/[0.02]
                          border
                          border-white/5
                          hover:bg-cyan-400/[0.025]
                          transition-all
                        "
                      >

                        <div className="flex items-start gap-3">

                          <span
                            className="
                              w-9
                              h-9
                              rounded-lg
                              bg-white/[0.035]
                              flex
                              items-center
                              justify-center
                              text-lg
                            "
                          >
                            {item.icon}
                          </span>

                          <div>

                            <p className="text-sm font-semibold text-gray-300">
                              {item.title}
                            </p>

                            <p className="text-xs text-gray-600 mt-1 leading-5">
                              {item.text}
                            </p>

                          </div>

                        </div>

                      </motion.button>
                    ))}

                  </div>

                </motion.div>
              )}

              {/* Messages */}

              <AnimatePresence initial={false}>

                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}`}
                    initial={{
                      opacity: 0,
                      y: 15,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[90%] md:max-w-[80%] ${
                        message.role === "user"
                          ? "items-end"
                          : "items-start"
                      }`}
                    >

                      {/* Role */}

                      <div
                        className={`flex items-center gap-2 mb-2 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        {message.role ===
                          "assistant" && (
                          <span
                            className="
                              w-6
                              h-6
                              rounded-lg
                              bg-cyan-400/10
                              border
                              border-cyan-400/15
                              flex
                              items-center
                              justify-center
                              text-xs
                            "
                          >
                            🤖
                          </span>
                        )}

                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">
                          {message.role ===
                          "user"
                            ? "You"
                            : "AI Mentor"}
                        </span>

                        {message.role ===
                          "user" && (
                          <span
                            className="
                              w-6
                              h-6
                              rounded-lg
                              bg-white/[0.05]
                              flex
                              items-center
                              justify-center
                              text-xs
                            "
                          >
                            👤
                          </span>
                        )}

                      </div>

                      {/* Bubble */}

                      <div
                        className={`relative rounded-2xl px-5 py-4 ${
                          message.role === "user"
                            ? `
                              bg-cyan-400
                              text-black
                              rounded-tr-md
                            `
                            : `
                              bg-white/[0.035]
                              border
                              border-white/8
                              text-gray-300
                              rounded-tl-md
                            `
                        }`}
                      >

                        <div
                          className="
                            whitespace-pre-wrap
                            text-sm
                            leading-7
                          "
                        >
                          {message.content}
                        </div>

                        {message.role ===
                          "assistant" && (
                          <div className="mt-4 pt-3 border-t border-white/5">

                            <button
                              onClick={() =>
                                copyMessage(
                                  message.content,
                                  index
                                )
                              }
                              className="
                                text-[11px]
                                text-gray-600
                                hover:text-cyan-400
                                transition-colors
                              "
                            >
                              {copiedIndex ===
                              index
                                ? "✓ Copied"
                                : "Copy response"}
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                  </motion.div>
                ))}

              </AnimatePresence>

              {/* Loading */}

              <AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="flex justify-start"
                  >

                    <div className="max-w-[85%]">

                      <div className="flex items-center gap-2 mb-2">

                        <span
                          className="
                            w-6
                            h-6
                            rounded-lg
                            bg-cyan-400/10
                            border
                            border-cyan-400/15
                            flex
                            items-center
                            justify-center
                            text-xs
                          "
                        >
                          🤖
                        </span>

                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">
                          AI Mentor
                        </span>

                      </div>

                      <div
                        className="
                          relative
                          overflow-hidden
                          rounded-2xl
                          rounded-tl-md
                          px-5
                          py-4
                          bg-cyan-400/[0.035]
                          border
                          border-cyan-400/10
                        "
                      >

                        {/* Scanning glow */}

                        <motion.div
                          animate={{
                            x: [
                              "-100%",
                              "200%",
                            ],
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
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-cyan-400
                            to-transparent
                          "
                        />

                        <div className="flex items-center gap-3">

                          <motion.div
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="
                              w-7
                              h-7
                              rounded-lg
                              border-2
                              border-cyan-400/20
                              border-t-cyan-400
                            "
                          />

                          <div>

                            <p className="text-sm font-semibold text-gray-300">
                              AI is thinking...
                            </p>

                            <p className="text-xs text-gray-600 mt-0.5">
                              Preparing a helpful explanation
                            </p>

                          </div>

                          <div className="flex gap-1 ml-2">

                            {[0, 1, 2].map(
                              (item) => (
                                <motion.span
                                  key={item}
                                  animate={{
                                    y: [
                                      0,
                                      -5,
                                      0,
                                    ],
                                    opacity: [
                                      0.3,
                                      1,
                                      0.3,
                                    ],
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat:
                                      Infinity,
                                    delay:
                                      item *
                                      0.15,
                                  }}
                                  className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-cyan-400
                                  "
                                />
                              )
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

              <div ref={messagesEndRef} />

            </div>

            {/* ================================================= */}
            {/* INPUT AREA */}
            {/* ================================================= */}

            <div
              className="
                border-t
                border-white/10
                p-4
                md:p-5
                bg-[#080f1c]/80
              "
            >

              <div
                className="
                  relative
                  rounded-2xl
                  border
                  border-white/10
                  focus-within:border-cyan-400/30
                  bg-[#050b14]
                  overflow-hidden
                  transition-all
                "
              >

                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={3}
                  placeholder="Ask your coding question..."
                  className="
                    w-full
                    bg-transparent
                    p-4
                    pr-16
                    text-sm
                    text-gray-200
                    placeholder:text-gray-700
                    outline-none
                    resize-none
                    leading-7
                  "
                />

                {/* Send */}

                <motion.button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !question.trim()
                  }
                  whileHover={{
                    scale:
                      loading ||
                      !question.trim()
                        ? 1
                        : 1.05,
                  }}
                  whileTap={{
                    scale:
                      loading ||
                      !question.trim()
                        ? 1
                        : 0.95,
                  }}
                  className="
                    absolute
                    right-3
                    bottom-3
                    w-10
                    h-10
                    rounded-xl
                    bg-cyan-400
                    hover:bg-cyan-300
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                    text-black
                    flex
                    items-center
                    justify-center
                    transition-all
                    shadow-lg
                    shadow-cyan-400/10
                  "
                >

                  {loading ? (
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
                  ) : (
                    <span className="text-lg">
                      ↑
                    </span>
                  )}

                </motion.button>

              </div>

              <div
                className="
                  flex
                  justify-between
                  items-center
                  mt-3
                  px-1
                "
              >

                <p className="text-[11px] text-gray-700">
                  Press Enter to send • Shift + Enter for new line
                </p>

                <p className="text-[11px] text-gray-700">
                  AI Coding Mentor
                </p>

              </div>

            </div>

          </motion.div>

          {/* ================================================= */}
          {/* BOTTOM INFO */}
          {/* ================================================= */}

          <AnimatePresence>

            {messages.length === 0 && !loading && (
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
                  grid
                  md:grid-cols-3
                  gap-4
                  mt-6
                "
              >

                {[
                  {
                    icon: "🎯",
                    title: "Beginner Friendly",
                    text: "Get explanations without complicated jargon.",
                  },
                  {
                    icon: "⚡",
                    title: "Instant Help",
                    text: "Ask questions and get AI-powered answers quickly.",
                  },
                  {
                    icon: "📚",
                    title: "Learn by Doing",
                    text: "Use every answer to strengthen your coding skills.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.55 +
                        index * 0.1,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="
                      bg-[#091321]/70
                      backdrop-blur-xl
                      border
                      border-white/5
                      hover:border-cyan-400/15
                      rounded-xl
                      p-5
                      transition-all
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-cyan-400/[0.06]
                        border
                        border-cyan-400/10
                        flex
                        items-center
                        justify-center
                        text-lg
                      "
                    >
                      {item.icon}
                    </div>

                    <h3 className="text-sm font-bold mt-4">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-6 mt-2">
                      {item.text}
                    </p>

                  </motion.div>
                ))}

              </motion.div>
            )}

          </AnimatePresence>

          <div className="h-10" />

        </div>

      </section>

    </main>
  );
}
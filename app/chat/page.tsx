"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "Explain React hooks in simple words",
  "What is the difference between let, const and var?",
  "How does async/await work in JavaScript?",
  "Explain Python functions with an example",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI Coding Mentor. Ask me anything about programming, code, debugging, or concepts. I'm here to help you learn step by step!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (question?: string) => {
    const messageText = (question || input).trim();

    if (!messageText || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chat",
          question: messageText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get AI response"
        );
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.result ||
          "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, aiMessage]);

      localStorage.setItem(
        "lastActivity",
        "Asked a question to AI Mentor"
      );

      localStorage.setItem(
        "lastActivityTime",
        new Date().toLocaleString()
      );
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          error instanceof Error
            ? `⚠️ Error: ${error.message}`
            : "⚠️ Something went wrong. Please try again.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (
    text: string,
    id: number
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      alert("Unable to copy the message.");
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Chat cleared! 🧹 What would you like to learn now?",
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-[#050b14] text-white overflow-hidden">
      {/* Background */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full animate-blob" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full animate-blob-slow" />

        <div className="absolute bottom-[-200px] left-1/3 w-[450px] h-[450px] bg-cyan-400/5 blur-[130px] rounded-full" />

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
          className="absolute top-20 right-[8%] text-7xl font-bold text-cyan-400/10"
        >
          {"</>"}
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-[8%] text-6xl font-bold text-cyan-400/10"
        >
          AI
        </motion.div>
      </div>

      {/* Sidebar */}

      <Sidebar />

      {/* Mobile Navigation */}

      <MobileNav />

      {/* Main */}

      <section className="relative z-10 min-h-screen pt-[76px] md:pt-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10">
          {/* Header */}

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
              duration: 0.5,
            }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors mb-6"
                >
                  ← Back to Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold tracking-wider">
                    AI CODING MENTOR
                  </span>

                  <span className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    AI Online
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Ask Your AI Mentor
                  <span className="text-cyan-400">.</span>
                </h1>

                <p className="text-gray-400 mt-3 text-base md:text-lg">
                  Get instant help with programming, concepts,
                  debugging, and more.
                </p>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={clearChat}
                className="self-start sm:self-auto px-4 py-2.5 border border-white/10 hover:border-red-400/30 hover:text-red-400 text-gray-400 rounded-xl text-sm transition-all"
              >
                🗑 Clear Chat
              </motion.button>
            </div>
          </motion.div>

          {/* Chat Container */}

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
              delay: 0.1,
            }}
            className="bg-[#091321]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Chat Header */}

            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/10 bg-white/[0.015]">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-xl"
                >
                  🤖
                </motion.div>

                <div>
                  <h2 className="font-bold text-gray-200">
                    CodeMentor AI
                  </h2>

                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Ready to help
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Secure AI Chat
              </div>
            </div>

            {/* Messages */}

            <div className="h-[430px] md:h-[500px] overflow-y-auto p-5 md:p-7 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className={`flex gap-3 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                        🤖
                      </div>
                    )}

                    <div
                      className={`group max-w-[85%] md:max-w-[75%] ${
                        message.role === "user"
                          ? "order-1"
                          : ""
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-5 py-4 whitespace-pre-wrap leading-7 text-[15px] ${
                          message.role === "user"
                            ? "bg-cyan-400 text-[#041018] rounded-tr-md font-medium"
                            : message.content.startsWith("⚠️")
                            ? "bg-red-400/5 border border-red-400/20 text-red-300 rounded-tl-md"
                            : "bg-white/[0.04] border border-white/10 text-gray-300 rounded-tl-md"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.role === "assistant" && (
                        <div className="flex items-center gap-3 mt-2 px-2">
                          <span className="text-[10px] text-gray-600">
                            CodeMentor AI
                          </span>

                          <button
                            onClick={() =>
                              copyMessage(
                                message.content,
                                message.id
                              )
                            }
                            className="text-[10px] text-gray-600 hover:text-cyan-400 transition"
                          >
                            {copiedId === message.id
                              ? "✓ Copied"
                              : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* AI Typing */}

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="flex items-end gap-3"
                  >
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      🤖
                    </div>

                    <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-md px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 rounded-full bg-cyan-400"
                        />

                        <motion.span
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 0.6,
                            delay: 0.15,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 rounded-full bg-cyan-400"
                        />

                        <motion.span
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 0.6,
                            delay: 0.3,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 rounded-full bg-cyan-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}

            {messages.length <= 1 && !loading && (
              <div className="px-5 md:px-7 pb-5">
                <p className="text-xs text-gray-500 mb-3">
                  ✨ Try asking:
                </p>

                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <motion.button
                      key={question}
                      whileHover={{
                        scale: 1.02,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      onClick={() =>
                        sendMessage(question)
                      }
                      className="text-left text-xs md:text-sm text-gray-400 hover:text-cyan-400 bg-white/[0.025] hover:bg-cyan-400/5 border border-white/10 hover:border-cyan-400/20 px-3 py-2 rounded-xl transition-all"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}

            <div className="border-t border-white/10 p-4 md:p-5 bg-[#07101d]/70">
              <div className="flex gap-3 items-end">
                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything about coding..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 max-h-32 min-h-[52px] bg-[#050b14] border border-white/10 hover:border-white/20 focus:border-cyan-400/50 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 outline-none resize-none transition-all"
                />

                <motion.button
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    loading || !input.trim()
                  }
                  whileHover={{
                    scale:
                      loading || !input.trim()
                        ? 1
                        : 1.05,
                  }}
                  whileTap={{
                    scale:
                      loading || !input.trim()
                        ? 1
                        : 0.95,
                  }}
                  className="h-[52px] px-5 md:px-6 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-[#041018] font-bold rounded-xl transition-all"
                >
                  {loading
                    ? "..."
                    : "Send ↑"}
                </motion.button>
              </div>

              <p className="text-[11px] text-gray-600 mt-3 px-1">
                Press Enter to send • Shift + Enter for a new line
              </p>
            </div>
          </motion.div>

          {/* Bottom Features */}

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
            className="grid md:grid-cols-3 gap-4 mt-6"
          >
            <div className="bg-white/[0.025] border border-white/5 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-300">
                💡 Ask Anything
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Programming concepts explained simply.
              </p>
            </div>

            <div className="bg-white/[0.025] border border-white/5 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-300">
                🐛 Get Help
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Understand bugs and improve your code.
              </p>
            </div>

            <div className="bg-white/[0.025] border border-white/5 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-300">
                🚀 Learn Faster
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Learn step by step with your AI mentor.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050b14] text-white overflow-hidden">
    {/* Animated Background */}

<div className="fixed inset-0 overflow-hidden pointer-events-none">

  {/* Glow Blobs */}

  <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full animate-blob" />

  <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-blue-500/10 blur-[130px] rounded-full animate-blob-slow" />

  <div className="absolute bottom-[-250px] left-1/3 w-[500px] h-[500px] bg-cyan-400/5 blur-[140px] rounded-full" />


  {/* Floating Code Elements */}

  <motion.div
    animate={{
      y: [0, -25, 0],
      rotate: [0, 8, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute top-32 left-[8%] text-cyan-400/20 text-6xl md:text-8xl font-bold select-none"
  >
    {"{ }"}
  </motion.div>


  <motion.div
    animate={{
      y: [0, 30, 0],
      rotate: [0, -10, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute top-52 right-[8%] text-cyan-300/20 text-5xl md:text-7xl font-bold select-none"
  >
    {"</>"}
  </motion.div>


  <motion.div
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 6, 0],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute bottom-40 left-[12%] text-blue-400/20 text-4xl md:text-6xl font-bold select-none"
  >
    AI
  </motion.div>


  <motion.div
    animate={{
      y: [0, 20, 0],
      rotate: [0, 10, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute bottom-32 right-[12%] text-cyan-400/15 text-5xl md:text-7xl font-bold select-none"
  >
    01
  </motion.div>


  <motion.div
    animate={{
      y: [0, -18, 0],
      rotate: [0, 15, 0],
      scale: [1, 1.15, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute top-[45%] left-[4%] text-cyan-300/20 text-3xl md:text-5xl select-none"
  >
    ⚡
  </motion.div>

</div>

      {/* Navbar */}

      <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 border-b border-white/10 bg-[#050b14]/70 backdrop-blur-xl">
        <Link href="/">
          <motion.h1
            whileHover={{ scale: 1.03 }}
            className="text-xl md:text-2xl font-bold cursor-pointer"
          >
            Code<span className="text-cyan-400">Mentor AI</span>
          </motion.h1>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a
            href="#features"
            className="hover:text-cyan-400 transition"
          >
            Features
          </a>

          <a
            href="#how"
            className="hover:text-cyan-400 transition"
          >
            How It Works
          </a>

          <a
            href="#preview"
            className="hover:text-cyan-400 transition"
          >
            AI Mentor
          </a>
        </div>

        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-cyan-400 hover:bg-cyan-300 text-black px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-cyan-400/10"
          >
            Get Started →
          </motion.button>
        </Link>
      </nav>

      {/* Hero Section */}

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-24 md:pt-32 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Your Personal AI Programming Mentor
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mt-7"
        >
          Learn to Code.
          <br />

          <span className="text-cyan-400">
            Build. Debug. Grow.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mt-7 leading-relaxed"
        >
          CodeMentor AI helps you understand code, find bugs,
          practice programming, and get instant answers from your
          personal AI Coding Mentor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-4 mt-10 flex-wrap"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-cyan-400 hover:bg-cyan-300 text-black px-7 py-3.5 rounded-xl font-bold transition shadow-lg shadow-cyan-400/10"
            >
              🚀 Start Learning
            </motion.button>
          </Link>

          <a href="#features">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.03] px-7 py-3.5 rounded-xl font-semibold transition"
            >
              Explore Features ↓
            </motion.button>
          </a>
        </motion.div>

        {/* Stats */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center gap-8 md:gap-16 mt-16 flex-wrap"
        >
          <div>
            <p className="text-2xl font-bold text-cyan-400">AI</p>
            <p className="text-xs text-gray-500 mt-1">
              Powered Learning
            </p>
          </div>

          <div className="hidden sm:block w-px bg-white/10" />

          <div>
            <p className="text-2xl font-bold">4+</p>
            <p className="text-xs text-gray-500 mt-1">
              Learning Tools
            </p>
          </div>

          <div className="hidden sm:block w-px bg-white/10" />

          <div>
            <p className="text-2xl font-bold text-cyan-400">
              24/7
            </p>

            <p className="text-xs text-gray-500 mt-1">
              AI Assistance
            </p>
          </div>
        </motion.div>
      </section>

      {/* AI Mentor Preview */}

      <section
        id="preview"
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#091321]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Window Header */}

          <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>

            <p className="text-xs text-gray-600">
              CodeMentor AI
            </p>

            <span className="text-xs text-emerald-400">
              ● AI Online
            </span>
          </div>

          {/* Chat Preview */}

          <div className="p-6 md:p-10 space-y-6">
            <div className="flex justify-end">
              <div className="max-w-xl bg-cyan-400 text-black rounded-2xl rounded-tr-sm px-5 py-4">
                <p className="font-medium">
                  Why is my Python loop not working?
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                🤖
              </div>

              <div className="max-w-2xl bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-sm px-5 py-5">
                <p className="text-cyan-400 font-semibold mb-3">
                  CodeMentor AI
                </p>

                <p className="text-gray-300 leading-7">
                  The issue may be in your loop condition. Make sure
                  your variable changes inside the loop, otherwise the
                  condition could remain true forever.
                </p>

                <div className="mt-4 bg-[#050b14] border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300">
                  <pre>{`for i in range(5):
    print(i)`}</pre>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}

      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-28"
      >
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-semibold tracking-wider">
            POWERFUL AI TOOLS
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Everything You Need to
            <br />
            Become a Better Developer.
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mt-5">
            Learn, understand, debug and improve your programming
            skills in one AI-powered workspace.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "📖",
              title: "Explain Code",
              text: "Understand your code with simple, beginner-friendly AI explanations.",
              href: "/explain",
            },
            {
              icon: "🐛",
              title: "Debug Code",
              text: "Find errors, understand why they happen and get corrected code.",
              href: "/debug",
            },
            {
              icon: "🧠",
              title: "Practice",
              text: "Solve programming challenges and receive AI-powered feedback.",
              href: "/practice",
            },
            {
              icon: "💬",
              title: "AI Chat",
              text: "Ask programming questions and learn with your personal AI mentor.",
              href: "/chat",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -6,
              }}
              className="bg-white/[0.035] border border-white/10 hover:border-cyan-400/30 rounded-2xl p-6 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-2xl">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-6 mt-3">
                {feature.text}
              </p>

              <Link
                href={feature.href}
                className="inline-block text-cyan-400 text-sm font-medium mt-6 hover:text-cyan-300"
              >
                Try now →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}

      <section
        id="how"
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 pb-28"
      >
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-semibold tracking-wider">
            SIMPLE & POWERFUL
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              number: "01",
              title: "Choose a Tool",
              text: "Select Explain, Debug, Practice or AI Chat.",
            },
            {
              number: "02",
              title: "Enter Your Code",
              text: "Paste your code or ask your programming question.",
            },
            {
              number: "03",
              title: "AI Analyzes",
              text: "Our AI understands your code and programming problem.",
            },
            {
              number: "04",
              title: "Learn & Improve",
              text: "Understand the solution and become a better developer.",
            },
          ].map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="relative"
            >
              <div className="text-cyan-400 text-4xl font-bold opacity-40">
                {step.number}
              </div>

              <h3 className="text-xl font-bold mt-5">
                {step.title}
              </h3>

              <p className="text-gray-500 text-sm leading-6 mt-3">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-cyan-400/[0.06] border border-cyan-400/20 rounded-3xl p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.06] to-transparent pointer-events-none" />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-3xl mx-auto">
              🚀
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mt-7">
              Ready to Become a Better
              <br />
              <span className="text-cyan-400">
                Programmer?
              </span>
            </h2>

            <p className="text-gray-400 max-w-xl mx-auto mt-5 leading-7">
              Start learning with your personal AI Coding Mentor and
              make your programming journey smarter and easier.
            </p>

            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 bg-cyan-400 hover:bg-cyan-300 text-black px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-cyan-400/10"
              >
                Start Learning with AI →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}

      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © 2026 CodeMentor AI. Learn. Code. Grow.
          </p>

          <div className="flex items-center gap-5 text-sm text-gray-500">
            <Link
              href="/dashboard"
              className="hover:text-cyan-400 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/chat"
              className="hover:text-cyan-400 transition"
            >
              AI Chat
            </Link>

            <Link
              href="/practice"
              className="hover:text-cyan-400 transition"
            >
              Practice
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
import React from 'react';
import {
  Code2,
  Bot,
  Terminal,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  GraduationCap,
  Layers,
  Cpu,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { navigateTo, setAuthModalOpen, setAuthModalMode, user } = useApp();

  const handleStartCoding = () => {
    navigateTo('practice');
  };

  const handleTryMentor = () => {
    navigateTo('mentor');
  };

  const features = [
    {
      icon: Bot,
      color: 'from-indigo-500 to-cyan-500',
      title: 'Socratic AI Coding Mentor',
      description:
        'Never get spoiled by instant code dumps. Our AI asks targeted guiding questions, explains line-by-line intuition, and adapts to beginner, intermediate, or advanced levels.',
      tag: 'Pedagogical AI',
    },
    {
      icon: Code2,
      color: 'from-blue-500 to-indigo-500',
      title: 'Curated College DSA Practice',
      description:
        'Battle-tested problems from campus recruitment & technical screenings. Multi-language starter templates in C++, Java, Python, and JavaScript with 3-tier progressive hints.',
      tag: 'University Curriculum',
    },
    {
      icon: Layers,
      color: 'from-purple-500 to-pink-500',
      title: 'Automated AI Code Review',
      description:
        'Submit code to receive a structured evaluation: correctness checks, potential edge-case bugs, time & space Big-O analysis, readability index, and refactored suggestions.',
      tag: 'Static Inspection',
    },
    {
      icon: Terminal,
      color: 'from-emerald-500 to-teal-500',
      title: 'Intelligent AI Debugger',
      description:
        'Paste your compiler errors, stack traces, or incorrect outputs. The AI pinpoints the exact culprit line, explains the root cause, and provides interview prevention tips.',
      tag: 'Root Cause Diagnosis',
    },
    {
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-500',
      title: 'Interactive Mock Interviews',
      description:
        'Simulate a live 4-round technical interview. Answer one question at a time, receive instant conversational feedback, and review a final scorecard on your algorithmic communication.',
      tag: 'Campus Placement Prep',
    },
    {
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-500',
      title: 'Deep Student Analytics',
      description:
        'Track daily coding streaks, problem-solving speed, topic mastery across Arrays, DP, and Trees, and export your progress report for college project reviews.',
      tag: 'Mastery Metrics',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Select a Topic or Problem',
      desc: 'Browse curated DSA topics aligned with engineering syllabi or jump into an open coding session.',
    },
    {
      num: '02',
      title: 'Code with Progressive Hints',
      desc: 'Write solutions in Python, C++, Java, or JS. Uncover gentle nudges when stuck without ruining the challenge.',
    },
    {
      num: '03',
      title: 'Get AI Review & Debugging',
      desc: 'Submit your solution for instant Big-O analysis, edge case testing, and compiler error troubleshooting.',
    },
    {
      num: '04',
      title: 'Ace Mock Technical Rounds',
      desc: 'Practice real-time technical questions with the AI interviewer and track your placement readiness.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* College Engineering Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-mono font-medium mb-6 shadow-inner animate-in fade-in">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Built for College & B.Tech Engineering Students</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Master Coding with an{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300">
            Intelligent Socratic Mentor
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          CodeMentor AI combines curated Data Structures & Algorithms practice with an empathetic, pedagogical AI mentor that guides your reasoning, reviews your code, and conducts mock placement interviews.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-start-coding-btn"
            onClick={handleStartCoding}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Code2 className="w-4 h-4" />
            <span>Start Coding Practice</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            id="hero-try-mentor-btn"
            onClick={handleTryMentor}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:border-slate-600"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Try AI Mentor Assistant</span>
          </button>
        </div>

        {/* Supported Languages & Quick Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Python 3.11
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> JavaScript / Node
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span> Java 17
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> C++ 20 (GCC)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Flame className="w-3.5 h-3.5" /> 100% Server-Side Gemini API
          </span>
        </div>
      </section>

      {/* Interactive Platform Preview Snippet */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
          {/* Top Bar of Window */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-xs font-mono text-slate-400">CodeMentor AI - Interactive Workspace</span>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/40">
              Socratic Mode: Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-xs font-mono">
            {/* Left: Code Block */}
            <div className="p-4 bg-slate-950/70">
              <div className="text-[11px] text-slate-400 mb-2 font-sans font-semibold flex items-center justify-between">
                <span>TwoSum.py (Student Attempt)</span>
                <span className="text-amber-400 text-[10px]">O(N^2) Brute Force Detected</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
{`class Solution:
    def twoSum(self, nums: list[int], target: int):
        # Student wrote nested loops
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`}
              </pre>
            </div>

            {/* Right: AI Mentor Feedback */}
            <div className="p-4 bg-slate-900/50">
              <div className="flex items-center gap-2 mb-2 font-sans font-semibold text-indigo-300 text-[11px]">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>AI Mentor Socratic Guidance</span>
              </div>
              <div className="space-y-2 text-slate-300 text-[11px] font-sans leading-relaxed">
                <p>
                  <strong>Great start!</strong> Your solution is correct and handles edge cases, but checking all pairs takes <strong>O(N²) time</strong>.
                </p>
                <div className="p-2.5 bg-indigo-950/40 border border-indigo-800/30 rounded-lg text-indigo-200">
                  <span className="font-semibold text-white">💡 Guided Question:</span> If you are inspecting number <code className="text-amber-300">x</code>, what complement do you need? Can a hash map find <code className="text-amber-300">target - x</code> in <strong className="text-emerald-400">O(1) time</strong>?
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleTryMentor}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 font-mono"
                  >
                    Open Mentor Chat <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            Engineered For Student Success
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything you need to master DSA & crack campus placements
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            A comprehensive suite of tools built on top of modern engineering pedagogy and Google's Gemini models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white border border-slate-700 group-hover:border-indigo-500/50 transition">
                      <Icon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {feat.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-850">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            The Learning Journey
          </h2>
          <h3 className="text-3xl font-bold text-white tracking-tight">How CodeMentor AI Elevates Your Skills</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 relative">
              <div className="text-3xl font-black font-mono text-indigo-500/30 mb-3">{st.num}</div>
              <h4 className="text-sm font-bold text-white mb-1.5">{st.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-700/40 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to accelerate your programming journey?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-indigo-200">
              Start practicing DSA problems, get personalized code reviews, and prepare for company placements with CodeMentor AI today.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                id="cta-bottom-start-btn"
                onClick={handleStartCoding}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition hover:scale-105"
              >
                Explore Practice Problems
              </button>
              <button
                id="cta-bottom-mentor-btn"
                onClick={handleTryMentor}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition"
              >
                Launch AI Mentor Chat
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

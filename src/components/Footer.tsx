import React from 'react';
import { Code2, Bot, Sparkles, ShieldCheck, Heart, Terminal, ExternalLink } from 'lucide-react';
import { useApp, AppPage } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-slate-850 bg-slate-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">CodeMentor AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An intelligent, Socratic coding mentor designed specifically for engineering and computer science students. Master DSA, ace technical interviews, and write production-grade code.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Gemini AI Engine Online
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px] font-mono">
              Learning Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo('mentor')}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  AI Socratic Mentor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('practice')}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  Coding Practice & DSA
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('review')}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI Code Reviewer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('debugger')}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Smart Error Debugger
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('interview')}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Mock Technical Interview
                </button>
              </li>
            </ul>
          </div>

          {/* Curriculum & Languages */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px] font-mono">
              College Curriculum
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>• Data Structures (Arrays, Lists, Stacks, Trees)</li>
              <li>• Algorithm Design (Greedy, DP, Graphs)</li>
              <li>• Languages: C++, Java, Python, JavaScript</li>
              <li>• Time & Space Complexity (Big-O analysis)</li>
              <li>• Campus Placement Technical Rounds</li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px] font-mono">
              Secure Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with React, TypeScript, and server-side Node.js proxying requests to Google's Gemini models. API keys remain strictly server-side.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
              <span className="text-indigo-400 font-semibold">Ready for:</span> Judge0 / Piston execution sandbox & Firebase Firestore persistence.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} CodeMentor AI. Built for college & university engineering students.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Server-side Gemini AI</span>
            <span>•</span>
            <span>Zero Client Key Exposure</span>
            <span>•</span>
            <span>B.Tech Project Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

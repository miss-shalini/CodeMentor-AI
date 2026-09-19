import React, { useState } from 'react';
import {
  Bug,
  Terminal,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { Language, DebugResult } from '../types';

export const DebuggerPage: React.FC = () => {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState<string>(`def find_max(arr):
    max_val = arr[0]
    for i in range(len(arr) + 1):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val

print(find_max([10, 20, 5, 80]))`);

  const [errorMessage, setErrorMessage] = useState<string>(
    `IndexError: list index out of range\n  File "solution.py", line 4, in find_max\n    if arr[i] > max_val:`
  );
  const [expectedBehavior, setExpectedBehavior] = useState<string>(
    'Should return 80 without crashing with an index error on empty or valid lists.'
  );

  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [copiedCorrected, setCopiedCorrected] = useState(false);

  const errorPresets = [
    {
      label: 'Python: IndexError (Off-by-One)',
      lang: 'python' as Language,
      code: `def find_max(arr):
    max_val = arr[0]
    for i in range(len(arr) + 1):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val

print(find_max([10, 20, 5, 80]))`,
      error: `IndexError: list index out of range\n  File "solution.py", line 4, in find_max\n    if arr[i] > max_val:`,
      expected: 'Return the maximum integer in the list.',
    },
    {
      label: 'C++: Segmentation Fault (Null Pointer)',
      lang: 'cpp' as Language,
      code: `struct Node {
    int val;
    Node* next;
};

int getHeadNext(Node* head) {
    // Missing null check for head->next
    return head->next->val;
}

int main() {
    Node* single = new Node{10, nullptr};
    std::cout << getHeadNext(single);
    return 0;
}`,
      error: `Segmentation fault (core dumped) - signal 11 (SIGSEGV)`,
      expected: 'Safely handle single-node lists or return an optional value without crashing.',
    },
    {
      label: 'JavaScript: Stack Overflow (Infinite Recursion)',
      lang: 'javascript' as Language,
      code: `function countdown(n) {
    console.log(n);
    // Missing base case n <= 0!
    return countdown(n - 1);
}

countdown(5);`,
      error: `RangeError: Maximum call stack size exceeded\n    at countdown (<anonymous>:4:12)`,
      expected: 'Stop recurse when n reaches 0.',
    },
    {
      label: 'Java: NullPointerException in HashMap',
      lang: 'java' as Language,
      code: `public class Solution {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        // Key "banana" not present, unboxing null to int throws NPE
        int count = map.get("banana");
        System.out.println(count);
    }
}`,
      error: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "java.lang.Integer.intValue()" because the return value of "java.util.Map.get(Object)" is null`,
      expected: 'Use getOrDefault("banana", 0) or null check before unboxing.',
    },
  ];

  const handleApplyPreset = (preset: typeof errorPresets[0]) => {
    setLanguage(preset.lang);
    setCode(preset.code);
    setErrorMessage(preset.error);
    setExpectedBehavior(preset.expected);
    setDebugResult(null);
  };

  const handleDebugCode = async () => {
    if (!code.trim() || isDebugging) return;
    setIsDebugging(true);

    try {
      const res = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          errorMessage,
          expectedBehavior,
        }),
      });

      const data = await res.json();
      if (data.likelyCause) {
        setDebugResult(data);
      } else {
        throw new Error(data.error || 'Failed to debug code');
      }
    } catch (err) {
      console.error('Debug error:', err);
    } finally {
      setIsDebugging(false);
    }
  };

  const handleCopyCorrected = () => {
    if (debugResult?.correctedCodeSnippet) {
      navigator.clipboard.writeText(debugResult.correctedCodeSnippet);
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Intelligent AI Error Debugger
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                Compiler & Runtime Root Cause
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Pinpoints exact problematic lines, diagnoses edge-case breakdowns, and provides interview prevention tips.
            </p>
          </div>
        </div>

        {/* Common College Error Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Presets:</span>
          {errorPresets.map((p, i) => (
            <button
              key={i}
              id={`preset-error-${i}`}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Buggy Snippet</h3>
            <select
              id="debugger-language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-rose-300 focus:outline-none"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Code to Inspect</label>
            <textarea
              id="debugger-code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={9}
              spellCheck={false}
              className="w-full p-3 font-mono text-xs text-slate-100 bg-slate-950 border border-slate-800 rounded-xl leading-6 focus:outline-none focus:border-rose-500 resize-none selection:bg-rose-600/40"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">
              Error Message, Stack Trace, or Wrong Output
            </label>
            <textarea
              id="debugger-error-input"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              rows={4}
              placeholder="e.g. IndexError, NullPointerException, Segmentation Fault..."
              className="w-full p-3 font-mono text-xs text-rose-300 bg-slate-950 border border-slate-800 rounded-xl leading-relaxed focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">
              Expected Outcome / Intended Behavior
            </label>
            <input
              id="debugger-expected-input"
              type="text"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            id="debugger-run-btn"
            onClick={handleDebugCode}
            disabled={!code.trim() || isDebugging}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className={`w-4 h-4 ${isDebugging ? 'animate-spin' : ''}`} />
            <span>{isDebugging ? 'Diagnosing Root Cause...' : 'Diagnose & Fix Bug'}</span>
          </button>
        </div>

        {/* Right Output: Diagnosis Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[560px]">
          {!debugResult ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-3">
              <Bug className="w-12 h-12 text-slate-700 animate-pulse" />
              <div className="max-w-md">
                <h4 className="text-sm font-semibold text-slate-300 mb-1">
                  Ready to Diagnose Errors
                </h4>
                <p className="text-xs text-slate-400">
                  Select a common error preset or input your compiler stack trace to receive root cause analysis and a clean patch.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Likely Cause Banner */}
              <div className="p-4 bg-rose-950/30 border border-rose-800/40 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Identified Root Cause</span>
                </div>
                <p className="text-sm font-semibold text-white mt-1">{debugResult.likelyCause}</p>
              </div>

              {/* Problematic Line Snippet */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Problematic Line / Construct</span>
                </div>
                <pre className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-rose-300 font-mono text-xs overflow-x-auto">
                  {debugResult.problematicCode}
                </pre>
              </div>

              {/* The Fix & Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>How to Fix</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{debugResult.fix}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5">
                  <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Why This Happens</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{debugResult.explanation}</p>
                </div>
              </div>

              {/* Prevention Tips for Interviews */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Interview & Coding Prevention Tips</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {debugResult.preventionTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Corrected Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    Corrected Code Snippet
                  </span>
                  <button
                    id="copy-debug-fix-btn"
                    onClick={handleCopyCorrected}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                  >
                    {copiedCorrected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCorrected ? 'Copied' : 'Copy Corrected Code'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                  {debugResult.correctedCodeSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

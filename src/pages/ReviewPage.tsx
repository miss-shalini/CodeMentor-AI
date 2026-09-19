import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Code2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, CodeReviewResult } from '../types';

export const ReviewPage: React.FC = () => {
  const { problems } = useApp();

  const [language, setLanguage] = useState<Language>('python');
  const [selectedProblemTitle, setSelectedProblemTitle] = useState<string>('Two Sum');
  const [code, setCode] = useState<string>(`class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Brute force checking all pairs
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`);

  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
  const [copiedImprovedCode, setCopiedImprovedCode] = useState(false);

  const presets = [
    {
      label: 'Two Sum (O(N²) Brute Force)',
      lang: 'python' as Language,
      problem: 'Two Sum',
      snippet: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
    },
    {
      label: 'Fibonacci (Exponential O(2ⁿ) Recursion)',
      lang: 'javascript' as Language,
      problem: 'Climbing Stairs / Fibonacci',
      snippet: `function fib(n) {
    if (n <= 1) return n;
    // Redundant recalculation without memoization
    return fib(n - 1) + fib(n - 2);
}`,
    },
    {
      label: 'Reverse Linked List (Null Pointer Risk)',
      lang: 'cpp' as Language,
      problem: 'Reverse Linked List',
      snippet: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setLanguage(preset.lang);
    setSelectedProblemTitle(preset.problem);
    setCode(preset.snippet);
    setReviewResult(null);
  };

  const handleRunReview = async () => {
    if (!code.trim() || isReviewing) return;
    setIsReviewing(true);

    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemContext: `Target Problem: ${selectedProblemTitle}`,
        }),
      });

      const data = await res.json();
      if (data.codeQualityScore !== undefined) {
        setReviewResult(data);
      } else {
        throw new Error(data.error || 'Failed to review code');
      }
    } catch (err: any) {
      console.error('Code review error:', err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopyImproved = () => {
    if (reviewResult?.improvedCode) {
      navigator.clipboard.writeText(reviewResult.improvedCode);
      setCopiedImprovedCode(true);
      setTimeout(() => setCopiedImprovedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Automated AI Code Review
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                Static & Algorithmic Inspection
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Evaluates code correctness, Big-O complexity, edge-case vulnerabilities, and provides idiomatic refactorings.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Presets:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              id={`preset-code-${i}`}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Input on Left, Analysis Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Code Input & Options (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Code Submission</h3>
            <div className="flex items-center gap-2">
              <select
                id="review-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-purple-300 focus:outline-none"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">
              Problem Context (Optional)
            </label>
            <input
              id="review-context-input"
              type="text"
              value={selectedProblemTitle}
              onChange={(e) => setSelectedProblemTitle(e.target.value)}
              placeholder="e.g. Two Sum, Valid Anagram, etc."
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">
              Paste or Edit Code to Inspect
            </label>
            <textarea
              id="review-code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full p-3 font-mono text-xs text-slate-100 bg-slate-950 border border-slate-800 rounded-xl leading-6 focus:outline-none focus:border-purple-500 selection:bg-purple-600/40 resize-none"
            />
          </div>

          <button
            id="review-run-btn"
            onClick={handleRunReview}
            disabled={!code.trim() || isReviewing}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className={`w-4 h-4 ${isReviewing ? 'animate-spin' : ''}`} />
            <span>{isReviewing ? 'Analyzing Code with Gemini...' : 'Perform AI Code Review'}</span>
          </button>
        </div>

        {/* Right Col: Structured Review Report (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[600px]">
          {!reviewResult ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-3">
              <FileCheck2 className="w-12 h-12 text-slate-700 animate-pulse" />
              <div className="max-w-md">
                <h4 className="text-sm font-semibold text-slate-300 mb-1">
                  Ready for AI Code Review
                </h4>
                <p className="text-xs text-slate-400">
                  Select a preset or paste your solution on the left, then click "Perform AI Code Review" to generate full Big-O and quality metrics.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score & Complexity Header Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                {/* Score */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-mono text-xl border ${
                      reviewResult.codeQualityScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : reviewResult.codeQualityScore >= 60
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {reviewResult.codeQualityScore}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">Code Quality Score</span>
                    <p className="text-[11px] text-slate-400">Scale of 0 to 100</p>
                  </div>
                </div>

                {/* Big-O Badges */}
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-right font-mono text-xs">
                    <span className="text-[10px] text-slate-500 uppercase block font-sans font-medium">
                      Time Complexity
                    </span>
                    <span className="text-indigo-400 font-bold">{reviewResult.timeComplexity}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-right font-mono text-xs">
                    <span className="text-[10px] text-slate-500 uppercase block font-sans font-medium">
                      Space Complexity
                    </span>
                    <span className="text-purple-400 font-bold">{reviewResult.spaceComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Correctness & Readability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correctness & Boundaries</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{reviewResult.correctness}</p>
                </div>

                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-850">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Readability & Style</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{reviewResult.readability}</p>
                </div>
              </div>

              {/* Potential Bugs */}
              {reviewResult.bugs && reviewResult.bugs.length > 0 && (
                <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Potential Vulnerabilities & Bugs</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                    {reviewResult.bugs.map((bug, i) => (
                      <li key={i}>{bug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optimization Suggestions */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-850 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Optimization Suggestions</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {reviewResult.optimizationSuggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>

              {/* Learning Suggestions */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-850 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Recommended CS Concepts to Study</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {reviewResult.learningSuggestions.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Refactored Clean Code */}
              {reviewResult.improvedCode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      Refactored Production Solution
                    </span>
                    <button
                      id="copy-improved-code-btn"
                      onClick={handleCopyImproved}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                    >
                      {copiedImprovedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedImprovedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-850 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                    {reviewResult.improvedCode}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

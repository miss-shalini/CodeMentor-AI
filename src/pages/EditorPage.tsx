import React, { useState } from 'react';
import {
  Code2,
  Lightbulb,
  Sparkles,
  Layers,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import { CodeEditor } from '../components/CodeEditor';
import { Language, CodeExecutionResult } from '../types';

export const EditorPage: React.FC = () => {
  const {
    activeProblem,
    navigateTo,
    markProblemSolved,
    addSubmission,
    createNewChatSession,
  } = useApp();

  const getStarterCode = (lang: Language) => {
    return activeProblem?.starterCodes?.[lang] || activeProblem?.starterTemplates?.[lang] || '';
  };

  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [currentCode, setCurrentCode] = useState<string>(
    getStarterCode(selectedLanguage) || getStarterCode('python')
  );

  // Progressive Hints state
  const [hintsUnlocked, setHintsUnlocked] = useState<number[]>([]);
  const [hintsData, setHintsData] = useState<{ [level: number]: any }>({});
  const [loadingHintLevel, setLoadingHintLevel] = useState<number | null>(null);

  // Switch starter template when language changes
  const handleLanguageChange = (newLang: Language) => {
    setSelectedLanguage(newLang);
    const codeForLang = getStarterCode(newLang);
    if (codeForLang) {
      setCurrentCode(codeForLang);
    }
  };

  const handleResetCode = () => {
    const codeForLang = getStarterCode(selectedLanguage);
    if (codeForLang) {
      setCurrentCode(codeForLang);
    }
  };

  // Run Code via backend execution architecture endpoint
  const handleRunCode = async (): Promise<CodeExecutionResult | null> => {
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language: selectedLanguage,
          testCases: activeProblem.testCases,
        }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error running code:', err);
      return null;
    }
  };

  // Submit Code
  const handleSubmitCode = async (): Promise<CodeExecutionResult | null> => {
    const result = await handleRunCode();
    if (result) {
      const passedCount = result.testResults.filter((t) => t.passed).length;
      const totalCount = result.testResults.length;
      const allPassed = passedCount === totalCount;

      addSubmission({
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        language: selectedLanguage,
        code: currentCode,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        runtimeMs: result.runtimeMs,
        memoryMb: result.memoryMb,
        passedTests: passedCount,
        totalTests: totalCount,
      });

      if (allPassed) {
        markProblemSolved(activeProblem.id, selectedLanguage, result.runtimeMs);
      }
    }
    return result;
  };

  // Unlock progressive hint via Gemini
  const handleUnlockHint = async (level: number) => {
    if (hintsData[level] || loadingHintLevel !== null) return;

    setLoadingHintLevel(level);
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: activeProblem.title,
          problemDescription: activeProblem.description,
          studentCode: currentCode,
          language: selectedLanguage,
          hintLevel: level,
        }),
      });
      const data = await res.json();
      setHintsData((prev) => ({ ...prev, [level]: data }));
      setHintsUnlocked((prev) => [...prev, level]);
    } catch (err) {
      console.error('Error unlocking hint:', err);
    } finally {
      setLoadingHintLevel(null);
    }
  };

  const handleAskMentor = () => {
    createNewChatSession(`Help with ${activeProblem.title}`, selectedLanguage, 'intermediate');
    navigateTo('mentor');
  };

  const handleReviewCode = () => {
    navigateTo('review');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex items-center justify-between">
        <button
          id="editor-back-to-practice-btn"
          onClick={() => navigateTo('practice')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Problem List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="editor-top-mentor-btn"
            onClick={handleAskMentor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 rounded-lg transition"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask Mentor About This</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen: Left Problem Description & Progressive Hints | Right Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Col: Problem Details & Hints (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[800px] space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/50">
                {activeProblem.topic}
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  activeProblem.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : activeProblem.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}
              >
                {activeProblem.difficulty}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{activeProblem.title}</h1>
          </div>

          {/* Description */}
          <div className="prose prose-invert prose-xs text-slate-300 leading-relaxed">
            <ReactMarkdown>{activeProblem.description}</ReactMarkdown>
          </div>

          {/* Examples */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">
              Test Case Examples
            </h4>
            {activeProblem.examples.map((ex, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-850 font-mono text-xs space-y-1">
                <div>
                  <span className="text-slate-500 font-sans">Input: </span>
                  <span className="text-slate-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans">Output: </span>
                  <span className="text-emerald-300">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-[11px] text-slate-400 font-sans mt-1 pt-1 border-t border-slate-850">
                    <span className="text-slate-500">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-1.5 pt-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">
              Constraints
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-400 font-mono space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
              {activeProblem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Progressive AI Hints (3-Tier) */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Progressive AI Hints (Gemini)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">No Instant Spoilers</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock pedagogical hints one level at a time. Each level guides your thinking without revealing the full solution.
            </p>

            <div className="space-y-2.5">
              {/* Hint 1: Nudge */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Level 1: Conceptual Nudge</span>
                  {hintsUnlocked.includes(1) ? (
                    <span className="text-[10px] text-emerald-400 font-mono">Unlocked</span>
                  ) : (
                    <button
                      id="unlock-hint-1-btn"
                      onClick={() => handleUnlockHint(1)}
                      disabled={loadingHintLevel === 1}
                      className="px-2.5 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium disabled:opacity-50"
                    >
                      {loadingHintLevel === 1 ? 'Generating...' : 'Unlock Hint 1'}
                    </button>
                  )}
                </div>
                {hintsData[1] && (
                  <div className="mt-2 text-xs text-slate-300 space-y-1 animate-in fade-in">
                    <p>{hintsData[1].guidance}</p>
                    {hintsData[1].guidingQuestion && (
                      <p className="text-indigo-300 font-medium italic mt-1">
                        🤔 {hintsData[1].guidingQuestion}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Hint 2: Strategy */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Level 2: Algorithmic Strategy</span>
                  {hintsUnlocked.includes(2) ? (
                    <span className="text-[10px] text-emerald-400 font-mono">Unlocked</span>
                  ) : (
                    <button
                      id="unlock-hint-2-btn"
                      onClick={() => handleUnlockHint(2)}
                      disabled={loadingHintLevel === 2 || !hintsUnlocked.includes(1)}
                      className="px-2.5 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium disabled:opacity-40"
                    >
                      {loadingHintLevel === 2 ? 'Generating...' : 'Unlock Hint 2'}
                    </button>
                  )}
                </div>
                {hintsData[2] && (
                  <div className="mt-2 text-xs text-slate-300 space-y-1 animate-in fade-in">
                    <p>{hintsData[2].guidance}</p>
                    {hintsData[2].guidingQuestion && (
                      <p className="text-indigo-300 font-medium italic mt-1">
                        💡 {hintsData[2].guidingQuestion}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Hint 3: Pseudocode Outline */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Level 3: Step-by-Step Pseudocode</span>
                  {hintsUnlocked.includes(3) ? (
                    <span className="text-[10px] text-emerald-400 font-mono">Unlocked</span>
                  ) : (
                    <button
                      id="unlock-hint-3-btn"
                      onClick={() => handleUnlockHint(3)}
                      disabled={loadingHintLevel === 3 || !hintsUnlocked.includes(2)}
                      className="px-2.5 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium disabled:opacity-40"
                    >
                      {loadingHintLevel === 3 ? 'Generating...' : 'Unlock Hint 3'}
                    </button>
                  )}
                </div>
                {hintsData[3] && (
                  <div className="mt-2 text-xs text-slate-300 space-y-1 animate-in fade-in font-mono">
                    <p className="font-sans">{hintsData[3].guidance}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Code Editor (7 cols) */}
        <div className="lg:col-span-7 h-[800px]">
          <CodeEditor
            code={currentCode}
            onChange={setCurrentCode}
            language={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onResetCode={handleResetCode}
            onRunCode={handleRunCode}
            onSubmitCode={handleSubmitCode}
            testCases={activeProblem.testCases}
            onAskMentorAboutCode={handleAskMentor}
            onReviewCode={handleReviewCode}
          />
        </div>
      </div>
    </div>
  );
};

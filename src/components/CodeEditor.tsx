import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Language, TestCase, CodeExecutionResult } from '../types';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: Language;
  onLanguageChange: (newLang: Language) => void;
  onResetCode: () => void;
  onRunCode: () => Promise<CodeExecutionResult | null>;
  onSubmitCode: () => Promise<CodeExecutionResult | null>;
  testCases: TestCase[];
  onAskMentorAboutCode?: () => void;
  onReviewCode?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onResetCode,
  onRunCode,
  onSubmitCode,
  testCases,
  onAskMentorAboutCode,
  onReviewCode,
}) => {
  const [activeTab, setActiveTab] = useState<'testcases' | 'output' | 'architecture'>('testcases');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [customInput, setCustomInput] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Line numbers calculation
  const lineCount = Math.max(code.split('\n').length, 12);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = '    ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('output');
    try {
      const res = await onRunCode();
      if (res) setExecutionResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab('output');
    try {
      const res = await onSubmitCode();
      if (res) setExecutionResult(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Editor Control Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            id="editor-language-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono font-medium text-indigo-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="python">Python 3.11</option>
            <option value="javascript">JavaScript (Node v20)</option>
            <option value="java">Java (OpenJDK 17)</option>
            <option value="cpp">C++ (GCC 13 / C++20)</option>
          </select>

          {/* Reset Code */}
          <button
            id="editor-reset-code-btn"
            onClick={onResetCode}
            title="Reset to starter template"
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            id="editor-copy-code-btn"
            onClick={handleCopy}
            title="Copy code to clipboard"
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* AI Action Quick Links */}
        <div className="flex items-center gap-2">
          {onAskMentorAboutCode && (
            <button
              id="editor-ask-mentor-btn"
              onClick={onAskMentorAboutCode}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/50 rounded-lg transition"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Ask AI Mentor</span>
            </button>
          )}

          {onReviewCode && (
            <button
              id="editor-review-code-btn"
              onClick={onReviewCode}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 rounded-lg transition"
            >
              <Layers className="w-3 h-3 text-purple-400" />
              <span>Review Code</span>
            </button>
          )}

          {/* Run Tests Button */}
          <button
            id="editor-run-tests-btn"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Evaluating...' : 'Run'}</span>
          </button>

          {/* Submit Solution Button */}
          <button
            id="editor-submit-btn"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Testing...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas (with Line Numbers & Textarea) */}
      <div className="relative flex-1 min-h-[280px] max-h-[460px] flex overflow-hidden bg-slate-950">
        {/* Line Numbers Column */}
        <div className="w-12 py-3 bg-slate-950/90 select-none border-r border-slate-850 text-right pr-2.5 font-mono text-[11px] text-slate-600 leading-6">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Input Area */}
        <textarea
          id="code-editor-textarea"
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="flex-1 w-full h-full p-3 font-mono text-xs text-slate-100 bg-transparent resize-none leading-6 focus:outline-none overflow-y-auto selection:bg-indigo-600/40"
          placeholder="// Type or paste your solution code here..."
        />
      </div>

      {/* Bottom Panel (Tabs: Test Cases, Output, Architecture) */}
      <div className="border-t border-slate-800 bg-slate-950">
        {/* Panel Tabs */}
        <div className="flex items-center justify-between px-3 border-b border-slate-850">
          <div className="flex items-center gap-1">
            <button
              id="tab-testcases-btn"
              onClick={() => setActiveTab('testcases')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                activeTab === 'testcases'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Cases ({testCases.length})
            </button>
            <button
              id="tab-output-btn"
              onClick={() => setActiveTab('output')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                activeTab === 'output'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Output & Results
            </button>
            <button
              id="tab-architecture-btn"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                activeTab === 'architecture'
                  ? 'border-indigo-500 text-indigo-300 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Execution Architecture
            </button>
          </div>

          {executionResult && (
            <div className="text-[11px] font-mono text-slate-400 hidden sm:flex items-center gap-3">
              <span>Runtime: <strong className="text-emerald-400">{executionResult.runtimeMs}ms</strong></span>
              <span>Memory: <strong className="text-indigo-400">{executionResult.memoryMb}MB</strong></span>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-3 max-h-56 overflow-y-auto font-mono text-xs">
          {activeTab === 'testcases' && (
            <div>
              {/* Test case pills */}
              <div className="flex items-center gap-2 mb-3">
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id}
                    id={`testcase-tab-${tc.id}`}
                    onClick={() => setSelectedTestCaseIndex(idx)}
                    className={`px-3 py-1 rounded-md text-xs font-sans font-medium transition ${
                      selectedTestCaseIndex === idx
                        ? 'bg-slate-800 text-indigo-400 border border-indigo-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Case {idx + 1} {tc.isHidden ? '(Hidden)' : ''}
                  </button>
                ))}
              </div>

              {testCases[selectedTestCaseIndex] && (
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">Input</span>
                    <div className="p-2 mt-1 bg-slate-900/80 rounded-lg border border-slate-850 text-slate-200">
                      {testCases[selectedTestCaseIndex].input}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">Expected Output</span>
                    <div className="p-2 mt-1 bg-slate-900/80 rounded-lg border border-slate-850 text-emerald-300">
                      {testCases[selectedTestCaseIndex].expectedOutput}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'output' && (
            <div>
              {!executionResult ? (
                <div className="py-6 text-center text-slate-500 font-sans">
                  <Terminal className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">Click "Run" or "Submit" to evaluate your code against the test suite.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Test Results Summary */}
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-850 font-sans">
                    {executionResult.testResults.map((tr) => (
                      <div
                        key={tr.testCaseId}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          tr.passed
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {tr.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        <span>Case {tr.testCaseId}: {tr.passed ? 'Passed' : 'Failed'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Standard Output Console */}
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-sans font-semibold">
                      Standard Console Output
                    </div>
                    <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 text-slate-300 text-xs whitespace-pre-wrap">
                      {executionResult.output}
                    </pre>
                  </div>

                  {/* Architecture Disclosure Banner */}
                  <div className="p-2.5 bg-indigo-950/40 border border-indigo-800/40 rounded-lg flex items-start gap-2 text-xs font-sans text-indigo-200">
                    <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Execution Provider Architecture:</span> {executionResult.note}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-2 text-xs font-sans text-slate-300">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold font-mono">
                <Cpu className="w-4 h-4" />
                <span>Transparent Code Execution Pipeline</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                To guarantee zero deceptive behavior and ensure reliable deployment, this application implements a clean server execution architecture ready to attach containerized sandboxes such as <strong>Judge0 API</strong> or <strong>Piston</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold mb-1">Supported Runtimes</div>
                  <ul className="text-slate-400 space-y-0.5">
                    <li>• Python 3.11 (Standard Library)</li>
                    <li>• JavaScript (Node.js ES2022)</li>
                    <li>• Java 17 (OpenJDK)</li>
                    <li>• C++ 20 (g++ with -O2 optimization)</li>
                  </ul>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-emerald-300 font-bold mb-1">Sandbox Integrations</div>
                  <ul className="text-slate-400 space-y-0.5">
                    <li>• Static pattern validation active</li>
                    <li>• Configurable \`EXECUTOR_URL\` endpoint</li>
                    <li>• Isolated memory limits (128MB)</li>
                    <li>• Execution timeout safety: 5.0s</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

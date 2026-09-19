import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  Cpu,
  GraduationCap,
  Lightbulb,
  Check,
  Copy,
  Terminal,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import { Language, StudentLevel } from '../types';

export const MentorPage: React.FC = () => {
  const {
    chatSessions,
    activeChatSession,
    setActiveChatSessionId,
    createNewChatSession,
    addMessageToActiveChat,
    activeProblem,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    activeChatSession?.language || 'python'
  );
  const [studentLevel, setStudentLevel] = useState<StudentLevel>(
    activeChatSession?.level || 'intermediate'
  );
  const [isSocraticMode, setIsSocraticMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatSession?.messages, isGenerating]);

  const presetPrompts = [
    {
      title: "Explain Kadane's Algorithm",
      desc: 'Intuition behind O(n) maximum subarray',
      prompt: "Can you explain the intuition behind Kadane's Algorithm for finding maximum subarray sum? Please provide a real-world analogy.",
    },
    {
      title: 'BFS vs DFS Decision Tree',
      desc: 'When to pick which graph traversal',
      prompt: 'How do I systematically choose between BFS and DFS in coding interviews? What are the space complexity trade-offs?',
    },
    {
      title: 'Dynamic Programming Subproblems',
      desc: 'Memoization vs Tabulation',
      prompt: 'Explain the difference between memoization (top-down) and tabulation (bottom-up) in Dynamic Programming with a simple Fibonacci or Coin Change example.',
    },
    {
      title: 'Master Theorem for Big-O',
      desc: 'Recurrence relation analysis',
      prompt: 'Break down how to find time complexity of divide-and-conquer algorithms using the Master Theorem in simple terms for university exams.',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = textToSend || inputMessage;
    if (!messageContent.trim() || isGenerating) return;

    if (!activeChatSession) {
      createNewChatSession('General Discussion', selectedLanguage, studentLevel);
    }

    // Add student message
    addMessageToActiveChat({
      role: 'user',
      content: messageContent.trim(),
    });

    if (!textToSend) {
      setInputMessage('');
    }

    setIsGenerating(true);

    try {
      // Build messages array for server API
      const currentMessages = activeChatSession?.messages || [];
      const apiMessages = [
        ...currentMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: messageContent.trim() },
      ];

      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          language: selectedLanguage,
          level: studentLevel,
          problemContext: `Student is in ${isSocraticMode ? 'Strict Socratic Guide Mode' : 'Direct Tutoring Mode'}. Active Problem: ${activeProblem?.title || 'General Coding'}`,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        addMessageToActiveChat({
          role: 'assistant',
          content: data.reply,
        });
      } else {
        throw new Error(data.error || 'No response returned from AI');
      }
    } catch (err: any) {
      addMessageToActiveChat({
        role: 'assistant',
        content: `⚠️ **Error communicating with AI Mentor**: ${err.message || 'Please check your connection and try again.'}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateNewChat = () => {
    createNewChatSession('New Topic', selectedLanguage, studentLevel);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Top Header & Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Socratic AI Mentor
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                Gemini 3.8 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Guided conceptual exploration, algorithmic intuition & line-by-line code reasoning
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Socratic Mode Toggle */}
          <button
            id="mentor-toggle-socratic"
            onClick={() => setIsSocraticMode(!isSocraticMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition ${
              isSocraticMode
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Socratic mode asks guiding questions rather than dumping the whole solution"
          >
            <Lightbulb className={`w-3.5 h-3.5 ${isSocraticMode ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Socratic Guide: {isSocraticMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Target Language */}
          <select
            id="mentor-language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* Student Level */}
          <select
            id="mentor-level-select"
            value={studentLevel}
            onChange={(e) => setStudentLevel(e.target.value as StudentLevel)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="beginner">Level: Beginner (1st/2nd Yr)</option>
            <option value="intermediate">Level: Intermediate (3rd Yr)</option>
            <option value="advanced">Level: Advanced (Placement Ready)</option>
          </select>

          {/* New Chat Button */}
          <button
            id="mentor-new-chat-btn"
            onClick={handleCreateNewChat}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Layout: Left Sidebar + Center Conversation */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
        {/* Left Sidebar: Sessions & Presets */}
        <div className="hidden md:flex flex-col gap-4 overflow-hidden">
          {/* Chat Sessions List */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2 px-1">
              <span>Saved Conversations</span>
              <span className="font-mono text-slate-500">{chatSessions.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {chatSessions.map((s) => {
                const isActive = s.id === activeChatSession?.id;
                return (
                  <button
                    key={s.id}
                    id={`session-item-${s.id}`}
                    onClick={() => setActiveChatSessionId(s.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition flex flex-col gap-1 ${
                      isActive
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="font-semibold truncate">{s.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="capitalize">{s.language}</span>
                      <span>{s.messages.length} msgs</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Prompts Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus DSA Prompts</span>
            </div>
            <div className="space-y-1.5">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-prompt-${idx}`}
                  onClick={() => handleSendMessage(p.prompt)}
                  disabled={isGenerating}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 transition text-[11px] disabled:opacity-50"
                >
                  <div className="font-medium text-slate-200">{p.title}</div>
                  <div className="text-[10px] text-slate-500">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Conversation Stream & Input */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          {/* Active Conversation Title Header */}
          <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">
                {activeChatSession?.title || 'Coding Mentorship Session'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>{studentLevel.toUpperCase()}</span>
              <span>•</span>
              <span className="capitalize">{selectedLanguage}</span>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeChatSession?.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                    }`}
                  >
                    {isUser ? 'You' : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950/90 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-xs sm:prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                    <div
                      className={`text-[10px] mt-2 font-mono ${
                        isUser ? 'text-indigo-200 text-right' : 'text-slate-500 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isGenerating && (
              <div className="flex gap-3 max-w-md mr-auto">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                  <span>CodeMentor AI is synthesizing guidance...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800">
            <div className="flex items-end gap-2 bg-slate-900 border border-slate-800 focus-within:border-indigo-500 rounded-xl p-2 transition">
              <textarea
                id="mentor-chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything (e.g., 'Why is quicksort worst case O(n^2)?', paste tricky code, or ask for hints)..."
                rows={2}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 py-1 leading-relaxed"
              />
              <button
                id="mentor-send-msg-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isGenerating}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg font-semibold shadow-md shadow-indigo-600/30 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
              <span>Press <strong className="text-slate-400">Enter</strong> to send, <strong className="text-slate-400">Shift + Enter</strong> for newline</span>
              <span className="text-indigo-400 font-mono">Gemini 3.8 Flash • Socratic Guide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

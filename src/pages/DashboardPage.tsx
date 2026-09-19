import React from 'react';
import {
  Code2,
  Flame,
  Clock,
  Sparkles,
  Bot,
  Bug,
  FileCheck2,
  Users,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const {
    user,
    problems,
    solvedProblemIds,
    submissions,
    chatSessions,
    navigateTo,
    setActiveProblem,
    setActiveChatSessionId,
  } = useApp();

  // Calculate stats
  const totalSolved = solvedProblemIds.length;
  const streak = user?.streak || 7;
  const totalMinutes = user?.totalCodingMinutes || 380;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Recommended problems (unsolved first)
  const recommendedProblems = problems.filter((p) => !solvedProblemIds.includes(p.id)).slice(0, 3);

  // Topic progress calculations
  const topicProgress = user?.topicProgress || {
    'Arrays': 75,
    'Strings & Stacks': 60,
    'Linked Lists': 50,
    'Dynamic Programming': 30,
    'Trees & BFS': 45,
  };

  const handleSolveProblem = (problem: any) => {
    setActiveProblem(problem);
    navigateTo('editor', problem.id);
  };

  const handleOpenChat = (chatId: string) => {
    setActiveChatSessionId(chatId);
    navigateTo('mentor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile & Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Student'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Welcome back, {user?.name || 'Developer'}!
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  Active Learner
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {user?.degree || 'B.Tech CSE'} • {user?.year || '3rd Year'} • {user?.college || 'Engineering Institute'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ready for today's coding session? Keep your streak alive!
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-btn-solve-next"
              onClick={() => navigateTo('practice')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Continue Practice</span>
            </button>
            <button
              id="dash-btn-ask-mentor"
              onClick={() => navigateTo('mentor')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Solved */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-sans">Problems Solved</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">{totalSolved}</span>
            <span className="text-xs text-slate-500 font-mono">/ {problems.length} total</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalSolved / problems.length) * 100)}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-sans">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">{streak}</span>
            <span className="text-xs text-slate-400 font-mono">days active</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Streak frozen for today
          </div>
        </div>

        {/* Total Coding Time */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-sans">Coding Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-300">
              {hours}h {minutes}m
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-400" />
            +45 mins this week
          </div>
        </div>

        {/* Placement Readiness */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-sans">Placement Readiness</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-purple-300">74%</span>
            <span className="text-xs text-purple-400 font-sans">Tier-1 SDE</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '74%' }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2 cols, Right 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Recommended Problems & Topic Progress) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Problems */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Recommended For You</h3>
                <p className="text-xs text-slate-400 mt-0.5">Based on your college syllabus and interview prep goals</p>
              </div>
              <button
                id="view-all-problems-btn"
                onClick={() => navigateTo('practice')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recommendedProblems.map((prob) => {
                const diffColor =
                  prob.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : prob.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                return (
                  <div
                    key={prob.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                          {prob.title}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diffColor}`}>
                          {prob.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Topic: {prob.topic}</span>
                        <span>•</span>
                        <span>Acceptance: {prob.acceptanceRate}</span>
                      </div>
                    </div>

                    <button
                      id={`rec-solve-btn-${prob.id}`}
                      onClick={() => handleSolveProblem(prob)}
                      className="px-3 py-1.5 bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white rounded-lg text-xs font-semibold transition self-start sm:self-center"
                    >
                      Solve Problem
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic-Wise Progress */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Topic-Wise Mastery</h3>
              <span className="text-xs text-slate-400 font-mono">B.Tech DSA Curriculum</span>
            </div>

            <div className="space-y-4">
              {Object.entries(topicProgress).map(([topic, percent]) => (
                <div key={topic}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-300">{topic}</span>
                    <span className="font-mono text-indigo-400 font-semibold">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Recent Submissions</h3>
              <span className="text-xs text-slate-400 font-mono">{submissions.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 pb-2">
                    <th className="py-2 font-medium">Problem</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Language</th>
                    <th className="py-2 font-medium">Runtime</th>
                    <th className="py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {submissions.slice(0, 4).map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-sans font-medium text-slate-200">{sub.problemTitle}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                            sub.status === 'Accepted'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400 capitalize">{sub.language}</td>
                      <td className="py-2.5 text-slate-300">{sub.runtimeMs}ms</td>
                      <td className="py-2.5 text-slate-500 text-[11px] font-sans">{sub.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Recent AI Mentor Chats & Tool Launchpad) */}
        <div className="space-y-8">
          {/* Quick AI Tool Launchpad */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-white tracking-tight mb-4">AI Power Tools</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                id="dash-launch-mentor"
                onClick={() => navigateTo('mentor')}
                className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">AI Coding Mentor</div>
                    <div className="text-[11px] text-slate-400">Ask concepts, logic & hints</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
              </button>

              <button
                id="dash-launch-review"
                onClick={() => navigateTo('review')}
                className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300">AI Code Review</div>
                    <div className="text-[11px] text-slate-400">Big-O analysis & bugs check</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition" />
              </button>

              <button
                id="dash-launch-debugger"
                onClick={() => navigateTo('debugger')}
                className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center">
                    <Bug className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-300">AI Error Debugger</div>
                    <div className="text-[11px] text-slate-400">Fix stack traces & segfaults</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition" />
              </button>

              <button
                id="dash-launch-interview"
                onClick={() => navigateTo('interview')}
                className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300">Mock Interview</div>
                    <div className="text-[11px] text-slate-400">Simulate technical placement round</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
              </button>
            </div>
          </div>

          {/* Recent AI Mentor Conversations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Recent Mentor Chats</h3>
              <button
                id="start-new-chat-btn"
                onClick={() => navigateTo('mentor')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                + New Chat
              </button>
            </div>

            <div className="space-y-2.5">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  id={`resume-chat-btn-${session.id}`}
                  onClick={() => handleOpenChat(session.id)}
                  className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 text-left transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">{session.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{session.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded text-indigo-300">{session.language}</span>
                    <span>•</span>
                    <span>{session.messages.length} messages</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

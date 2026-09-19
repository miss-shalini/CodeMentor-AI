import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Flame,
  Clock,
  Award,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressPage: React.FC = () => {
  const { user, problems, solvedProblemIds, submissions, interviewSessions } = useApp();

  const [copiedSummary, setCopiedSummary] = useState(false);

  const totalProblems = problems.length;
  const solvedCount = solvedProblemIds.length;
  const solvedPercent = Math.round((solvedCount / totalProblems) * 100);

  const topicProgress = user?.topicProgress || {
    'Arrays': 75,
    'Strings & Stacks': 60,
    'Linked Lists': 50,
    'Dynamic Programming': 30,
    'Trees & BFS': 45,
    'Two Pointers & Stack': 25,
  };

  const handleExportReport = () => {
    const reportData = {
      platform: 'CodeMentor AI',
      generatedAt: new Date().toISOString(),
      studentProfile: {
        name: user?.name,
        email: user?.email,
        college: user?.college,
        degree: user?.degree,
        year: user?.year,
      },
      metrics: {
        problemsSolved: `${solvedCount} / ${totalProblems} (${solvedPercent}%)`,
        currentStreak: `${user?.streak || 7} days`,
        codingTimeMinutes: user?.totalCodingMinutes || 380,
        interviewSessionsCount: interviewSessions.length,
      },
      topicMastery: topicProgress,
      solvedProblemIds,
      recentSubmissions: submissions.slice(0, 10),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CodeMentorAI_ProgressReport_${user?.name?.replace(/\s+/g, '_') || 'Student'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummaryText = () => {
    const summaryText = `🎓 CodeMentor AI - Student Progress Report
Name: ${user?.name || 'Aarav Sharma'}
Institution: ${user?.college || 'Engineering Institute'}
Degree: ${user?.degree || 'B.Tech CSE'} (${user?.year || '3rd Year'})
Problems Solved: ${solvedCount}/${totalProblems} (${solvedPercent}%)
Daily Streak: ${user?.streak || 7} days
Topic Mastery:
${Object.entries(topicProgress)
  .map(([topic, pct]) => `- ${topic}: ${pct}%`)
  .join('\n')}
Recent Accepted Submissions: ${submissions.filter((s) => s.status === 'Accepted').length} problems.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Academic & Placement Progress
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                Verified Metrics
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Track your algorithmic mastery across college semester topics and download placement-ready verification records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-summary-text-btn"
            onClick={handleCopySummaryText}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            {copiedSummary ? 'Copied Summary!' : 'Copy Summary'}
          </button>
          <button
            id="export-progress-json-btn"
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (.json)</span>
          </button>
        </div>
      </div>

      {/* Student Academic Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Enrolled Student Profile
          </span>
          <h2 className="text-xl font-bold text-white mt-1">{user?.name}</h2>
          <p className="text-xs text-slate-300 mt-0.5">{user?.college}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {user?.degree}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {user?.year}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              ID: {user?.id}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Solved Curriculum</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {solvedCount} <span className="text-xs text-slate-500">/ {totalProblems}</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">{solvedPercent}% syllabus completed</div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Streak</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {user?.streak || 7} <span className="text-xs text-slate-500">days</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Daily practice discipline</div>
        </div>
      </div>

      {/* Topic Mastery Detailed Bars */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Curriculum Topic Mastery</h3>
            <p className="text-xs text-slate-400">
              Progress calculated based on problem submissions and AI code review scores.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400">AI Verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(topicProgress).map(([topic, pct]) => (
            <div key={topic} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{topic}</span>
                <span className="font-mono text-indigo-400 font-bold">{pct}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Core Syllabus</span>
                <span>{pct >= 70 ? 'Placement Ready' : pct >= 40 ? 'Proficient' : 'Needs Practice'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interview Records & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mock Interview History */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight">Mock Interview Records</h3>
          {interviewSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-850">
              No completed mock interview sessions yet. Try a 3-question mock round in "Interview Mode"!
            </div>
          ) : (
            <div className="space-y-3">
              {interviewSessions.map((int) => (
                <div key={int.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{int.topic}</span>
                    <span className="text-emerald-400 font-mono font-bold">{int.overallScore}/100</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Role: {int.targetRole} • {int.difficulty}</div>
                  <div className="text-[11px] text-slate-500 font-sans italic mt-1">"{int.finalFeedback}"</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Coding Submissions */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight">Submission History</h3>
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{sub.problemTitle}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    <span className="capitalize">{sub.language}</span> • {sub.runtimeMs}ms • {sub.timestamp}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                    sub.status === 'Accepted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

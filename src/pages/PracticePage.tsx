import React, { useState } from 'react';
import {
  Code2,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  GraduationCap,
  Layers,
  Flame,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Problem, Difficulty } from '../types';

export const PracticePage: React.FC = () => {
  const { problems, solvedProblemIds, setActiveProblem, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');

  // Extract unique topics
  const topics = ['All', ...Array.from(new Set(problems.map((p) => p.topic)))];

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const problemTags = p.tags || [p.topic, p.difficulty];
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problemTags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;

    const isSolved = solvedProblemIds.includes(p.id);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'solved' && isSolved) ||
      (statusFilter === 'unsolved' && !isSolved);

    return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
  });

  const handleStartSolve = (problem: Problem) => {
    setActiveProblem(problem);
    navigateTo('editor', problem.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Curated Problem Practice
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {solvedProblemIds.length} / {problems.length} Solved
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Hand-picked algorithms and data structures questions frequently asked in campus placements and technical evaluations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-slate-400">Placement Syllabus Progress</span>
            <span className="text-emerald-400 font-mono font-bold">
              {Math.round((solvedProblemIds.length / problems.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(solvedProblemIds.length / problems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            id="practice-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, topics, or tags (e.g., Two Sum, DP, Hash Table)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            id="practice-difficulty-filter"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Topic Filter */}
          <select
            id="practice-topic-filter"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Topics' : t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="practice-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Problems Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold w-12 text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold">Title & College Tags</th>
                <th className="py-3.5 px-4 font-semibold">Topic</th>
                <th className="py-3.5 px-4 font-semibold">Difficulty</th>
                <th className="py-3.5 px-4 font-semibold">Acceptance</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No problems matched your search or filters. Try adjusting the query.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const isSolved = solvedProblemIds.includes(prob.id);
                  const diffColor =
                    prob.difficulty === 'Easy'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : prob.difficulty === 'Medium'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => handleStartSolve(prob)}
                    >
                      {/* Solved Icon */}
                      <td className="py-3.5 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 mx-auto group-hover:border-indigo-400" />
                        )}
                      </td>

                      {/* Title & Tags */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-indigo-300 transition text-sm">
                          {prob.title}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(prob.tags || [prob.topic, prob.difficulty]).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{prob.topic}</td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${diffColor}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Acceptance */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{prob.acceptanceRate}</td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`solve-btn-${prob.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartSolve(prob);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 ${
                            isSolved
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                          }`}
                        >
                          <span>{isSolved ? 'Solve Again' : 'Solve'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

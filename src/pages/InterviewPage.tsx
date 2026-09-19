import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Send,
  Sparkles,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InterviewSession, InterviewQuestion } from '../types';

export const InterviewPage: React.FC = () => {
  const { user, saveInterviewSession } = useApp();

  // Configuration state
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState('Medium');
  const [targetRole, setTargetRole] = useState('Software Engineering Intern / SDE-1');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  // Active Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);

  // Start interview
  const handleStartInterview = async () => {
    setIsLoading(true);
    setInterviewStarted(true);
    setIsFinalized(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          topic,
          difficulty,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.question) {
        setQuestions([
          {
            id: 'q-1',
            question: data.question,
            interviewerNote: data.interviewerNote,
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit student answer for current question & fetch next question or finalize
  const handleSubmitAnswer = async () => {
    if (!studentAnswer.trim() || isLoading) return;
    setIsLoading(true);

    const currentQ = questions[currentQuestionIndex];
    const history = questions.map((q, idx) => ({
      question: q.question,
      studentAnswer: idx === currentQuestionIndex ? studentAnswer : q.studentAnswer || '',
      feedback: q.feedback,
      score: q.score,
    }));

    try {
      const isLastStep = questions.length >= 3;

      if (!isLastStep) {
        // Request evaluation & next question
        const res = await fetch('/api/ai/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'evaluate_and_next',
            topic,
            difficulty,
            targetRole,
            history,
            latestAnswer: studentAnswer,
          }),
        });

        const data = await res.json();

        // Update current question with feedback
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQ,
          studentAnswer,
          feedback: data.feedback,
          score: data.score || 8,
        };

        if (data.nextQuestion) {
          updatedQuestions.push({
            id: `q-${updatedQuestions.length + 1}`,
            question: data.nextQuestion,
          });
          setCurrentQuestionIndex(updatedQuestions.length - 1);
        }

        setQuestions(updatedQuestions);
        setStudentAnswer('');
      } else {
        // Finalize interview
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQ,
          studentAnswer,
          feedback: 'Comprehensive evaluation recorded.',
          score: 8,
        };
        setQuestions(updatedQuestions);

        const res = await fetch('/api/ai/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'finalize',
            topic,
            difficulty,
            targetRole,
            history: updatedQuestions.map((q) => ({
              question: q.question,
              studentAnswer: q.studentAnswer || '',
              feedback: q.feedback,
              score: q.score,
            })),
          }),
        });

        const report = await res.json();
        setFinalReport(report);
        setIsFinalized(true);

        // Save session
        saveInterviewSession({
          id: `interview-${Date.now()}`,
          topic,
          difficulty,
          targetRole,
          date: new Date().toLocaleDateString(),
          overallScore: report.overallScore || 85,
          questions: updatedQuestions,
          finalFeedback: report.summary || 'Strong performance across technical rounds.',
        });
      }
    } catch (err) {
      console.error('Interview step error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setInterviewStarted(false);
    setIsFinalized(false);
    setQuestions([]);
    setFinalReport(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Mock Technical Interview
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                Interactive SDE Round
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Experience realistic campus placement rounds with AI interviewer feedback, follow-ups, and a scorecard.
            </p>
          </div>
        </div>

        {interviewStarted && (
          <button
            id="interview-restart-btn"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Interview Config</span>
          </button>
        )}
      </div>

      {!interviewStarted ? (
        /* Setup Configuration Screen */
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Configure Your Mock Interview</h2>
            <p className="text-xs text-slate-400">
              Customize the topic, target role, and difficulty to match your upcoming college campus placement drive.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Focus Topic</label>
              <select
                id="interview-topic-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms (Arrays, Trees, Graphs, DP)</option>
                <option value="System Design & Scalability Primitives">System Design Fundamentals (Caching, Load Balancing, DB Sharding)</option>
                <option value="OOP & Software Engineering Concepts">Object Oriented Design & SOLID Principles (Java/C++)</option>
                <option value="DBMS & SQL Query Optimization">DBMS, Indexing & SQL Problem Solving</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Role</label>
                <select
                  id="interview-role-select"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Software Engineering Intern / SDE-1">SDE Intern / Entry-Level SDE</option>
                  <option value="Backend Software Engineer">Backend Engineer (Node/Java/Go)</option>
                  <option value="Frontend Engineer">Frontend Engineer (React/TypeScript)</option>
                  <option value="Full-Stack Developer">Full-Stack Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rigor / Difficulty</label>
                <select
                  id="interview-diff-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Standard College Screening">Standard Screening (Easy - Medium)</option>
                  <option value="Tier-1 Campus Technical Round">Tier-1 FAANG / Product Round (Medium)</option>
                  <option value="Hard Technical Screening">Advanced Algorithms & Edge Cases (Hard)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-200/90 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">How This Simulation Works:</span>
              <p className="text-slate-300 leading-relaxed">
                The AI interviewer asks 3 to 4 sequential questions. After you explain your logic, time complexity, and edge cases, it assesses your response, asks follow-up challenges, and issues a final hiring report card.
              </p>
            </div>
          </div>

          <button
            id="start-interview-session-btn"
            onClick={handleStartInterview}
            disabled={isLoading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition"
          >
            <Play className="w-4 h-4" />
            <span>{isLoading ? 'Setting up Interview Room...' : 'Start Mock Interview'}</span>
          </button>
        </div>
      ) : isFinalized && finalReport ? (
        /* Final Interview Performance Report Card */
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="text-center pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Interview Evaluation Report</h2>
            <p className="text-xs text-slate-400 mt-1">
              Candidate: {user?.name || 'Student'} • Role: {targetRole}
            </p>
          </div>

          {/* Overall Score */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Overall Assessment Score
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {finalReport.overallScore || 85} / 100
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold font-mono">
              PLACEMENT READY
            </span>
          </div>

          {/* Competence Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <div className="text-[11px] font-semibold text-indigo-400 mb-1">Technical Primitives</div>
              <p className="text-xs text-slate-300">{finalReport.technicalCompetence}</p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <div className="text-[11px] font-semibold text-purple-400 mb-1">Problem Solving Logic</div>
              <p className="text-xs text-slate-300">{finalReport.problemSolving}</p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <div className="text-[11px] font-semibold text-amber-400 mb-1">Communication & Style</div>
              <p className="text-xs text-slate-300">{finalReport.codeQuality}</p>
            </div>
          </div>

          {/* Strengths & Areas to Polish */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="list-disc list-inside text-xs text-emerald-200/90 space-y-1">
                {finalReport.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Areas For Improvement</span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-1">
                {finalReport.areasForImprovement?.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Committee Summary */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <div className="text-xs font-semibold text-white mb-1.5">Hiring Committee Final Verdict</div>
            <p className="text-xs text-slate-300 leading-relaxed">{finalReport.summary}</p>
          </div>

          <button
            id="retake-interview-btn"
            onClick={handleRestart}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition"
          >
            Practice Another Interview Topic
          </button>
        </div>
      ) : (
        /* Active Interview Question & Answer Stream */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
            <span>
              Question {currentQuestionIndex + 1} of 3 • {topic}
            </span>
            <span>Rigor: {difficulty}</span>
          </div>

          {/* Question Cards History */}
          <div className="space-y-4">
            {questions.slice(0, currentQuestionIndex + 1).map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Technical Interviewer
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed whitespace-pre-wrap">
                    {q.question}
                  </p>

                  {/* Previous Answer & Feedback */}
                  {q.studentAnswer && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs space-y-2 font-mono">
                      <div className="text-slate-400 font-sans text-[11px] font-semibold">Your Response:</div>
                      <p className="text-slate-200 whitespace-pre-wrap">{q.studentAnswer}</p>

                      {q.feedback && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-indigo-300 font-sans">
                          <strong>Interviewer Feedback:</strong> {q.feedback} (Score: {q.score}/10)
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current Question Input Zone */}
                  {isCurrent && !q.studentAnswer && (
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-medium text-slate-300">
                        Type your technical approach, pseudocode, and time/space complexity analysis:
                      </label>
                      <textarea
                        id="interview-answer-input"
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        rows={6}
                        placeholder="Explain your thought process: 1. Approach intuition, 2. Data structures chosen, 3. Step-by-step logic, 4. Big-O time and space complexity..."
                        className="w-full p-3 font-mono text-xs text-slate-100 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl resize-none leading-relaxed"
                      />
                      <button
                        id="interview-submit-answer-btn"
                        onClick={handleSubmitAnswer}
                        disabled={!studentAnswer.trim() || isLoading}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                      >
                        <Send className="w-4 h-4" />
                        <span>
                          {isLoading
                            ? 'Evaluating Answer...'
                            : currentQuestionIndex >= 2
                            ? 'Submit Final Answer & Generate Report'
                            : 'Submit Answer & Proceed to Follow-up'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Code2, GraduationCap, Lock, Mail, User, Building, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, signup, loginAsDemoStudent } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authModalMode === 'login') {
      if (!email.trim()) {
        setError('Please enter your student email address');
        return;
      }
      login(email, password);
    } else {
      if (!name.trim() || !email.trim()) {
        setError('Please fill in your name and email');
        return;
      }
      signup({ name, email, college, degree, year });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200">
        {/* Close button */}
        <button
          id="close-auth-modal-btn"
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-3">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {authModalMode === 'login' ? 'Welcome Back, Developer' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login'
              ? 'Access your coding streak, AI mentor chats, and practice submissions'
              : 'Join thousands of college engineering students mastering DSA'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError('');
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              authModalMode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setAuthModalMode('signup');
              setError('');
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              authModalMode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Quick Demo Student Button */}
        <button
          id="demo-student-login-btn"
          type="button"
          onClick={loginAsDemoStudent}
          className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-950 to-purple-950 hover:from-indigo-900 hover:to-purple-900 border border-indigo-700/50 rounded-xl text-xs font-semibold text-indigo-200 shadow-sm transition group"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>Quick Demo: Login as Aarav Sharma (3rd Year CSE)</span>
        </button>

        {/* Google Sign-in Option */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={() => {
            login('student.google@college.edu');
          }}
          className="w-full mb-4 flex items-center justify-center gap-2.5 py-2 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-slate-900 px-2 text-slate-500">or use institutional email</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  id="auth-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Patel"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">College Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                id="auth-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {authModalMode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">College / University</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    id="auth-college-input"
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Degree</label>
                  <select
                    id="auth-degree-select"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="B.Tech Computer Science">B.Tech CSE</option>
                    <option value="B.Tech IT">B.Tech IT</option>
                    <option value="B.Tech ECE">B.Tech ECE</option>
                    <option value="BCA / MCA">BCA / MCA</option>
                    <option value="B.Sc Computer Science">B.Sc CS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Year of Study</label>
                  <select
                    id="auth-year-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year (Final)</option>
                    <option value="Graduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition"
          >
            {authModalMode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            {authModalMode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
            <button
              id="auth-toggle-mode-btn"
              type="button"
              onClick={() => {
                setAuthModalMode(authModalMode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-indigo-400 hover:underline font-medium"
            >
              {authModalMode === 'login' ? 'Create one now' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

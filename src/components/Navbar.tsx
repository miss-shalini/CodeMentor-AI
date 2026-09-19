import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Bot,
  Bug,
  FileCheck2,
  Users,
  LineChart,
  Flame,
  Clock,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Play,
  Pause,
  GraduationCap,
} from 'lucide-react';
import { useApp, AppPage } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activePage,
    navigateTo,
    user,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    solvedProblemIds,
    codingTimerSeconds,
    isTimerRunning,
    toggleTimer,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const navLinks: { page: AppPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: LineChart },
    { page: 'practice', label: 'Practice', icon: Code2 },
    { page: 'mentor', label: 'AI Mentor', icon: Bot },
    { page: 'review', label: 'Code Review', icon: FileCheck2 },
    { page: 'debugger', label: 'AI Debugger', icon: Bug },
    { page: 'interview', label: 'Interview Mode', icon: Users },
    { page: 'progress', label: 'Progress', icon: GraduationCap },
  ];

  const handleNav = (page: AppPage) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  CodeMentor <span className="text-indigo-400 text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/50">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  College Dev Platform
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-inner border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Coding Session Timer */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTimer(codingTimerSeconds)}</span>
              <button
                id="timer-toggle-btn"
                onClick={toggleTimer}
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
              </button>
            </div>

            {/* Streak Counter */}
            {user && (
              <div
                title={`${user.streak} day streak! Keep practicing daily.`}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-medium"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{user.streak}d</span>
              </div>
            )}

            {/* Solved Problems Counter */}
            <button
              id="solved-counter-btn"
              onClick={() => handleNav('practice')}
              title="View solved problems"
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{solvedProblemIds.length} Solved</span>
            </button>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/80 transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-indigo-500/50"
                  />
                  <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.college}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                        {user.degree} • {user.year}
                      </span>
                    </div>
                    <button
                      id="dropdown-dashboard-btn"
                      onClick={() => {
                        handleNav('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                    >
                      <LineChart className="w-3.5 h-3.5 text-indigo-400" />
                      Dashboard
                    </button>
                    <button
                      id="dropdown-progress-btn"
                      onClick={() => {
                        handleNav('progress');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                      Progress & Stats
                    </button>
                    <div className="border-t border-slate-800 my-1"></div>
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  id="navbar-signup-btn"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg text-xs font-mono text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{formatTimer(codingTimerSeconds)}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{solvedProblemIds.length} Solved</span>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  id={`mobile-nav-${item.page}`}
                  onClick={() => handleNav(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-slate-200 font-medium">{user.name}</span>
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={logout}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-medium text-slate-200 bg-slate-900 rounded-lg border border-slate-800"
                >
                  Sign In
                </button>
                <button
                  id="mobile-signup-btn"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

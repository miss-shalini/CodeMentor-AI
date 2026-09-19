import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PracticePage } from './pages/PracticePage';
import { EditorPage } from './pages/EditorPage';
import { MentorPage } from './pages/MentorPage';
import { ReviewPage } from './pages/ReviewPage';
import { DebuggerPage } from './pages/DebuggerPage';
import { InterviewPage } from './pages/InterviewPage';
import { ProgressPage } from './pages/ProgressPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {activePage === 'landing' && <LandingPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'practice' && <PracticePage />}
        {activePage === 'editor' && <EditorPage />}
        {activePage === 'mentor' && <MentorPage />}
        {activePage === 'review' && <ReviewPage />}
        {activePage === 'debugger' && <DebuggerPage />}
        {activePage === 'interview' && <InterviewPage />}
        {activePage === 'progress' && <ProgressPage />}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

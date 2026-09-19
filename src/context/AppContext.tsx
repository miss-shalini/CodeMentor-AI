import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Problem,
  Submission,
  ChatSession,
  ChatMessage,
  InterviewSession,
  Language,
  StudentLevel,
} from '../types';
import { PROBLEMS } from '../data/problems';

export type AppPage =
  | 'landing'
  | 'dashboard'
  | 'practice'
  | 'editor'
  | 'mentor'
  | 'review'
  | 'debugger'
  | 'interview'
  | 'progress';

interface AppContextType {
  // Navigation
  activePage: AppPage;
  navigateTo: (page: AppPage, problemId?: string) => void;

  // Authentication
  user: User | null;
  login: (email: string, password?: string) => void;
  signup: (userData: { name: string; email: string; college: string; degree: string; year: string }) => void;
  logout: () => void;
  loginAsDemoStudent: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;

  // Problems & Practice
  problems: Problem[];
  activeProblem: Problem;
  setActiveProblem: (problem: Problem) => void;
  solvedProblemIds: string[];
  markProblemSolved: (problemId: string, language: Language, runtimeMs?: number) => void;

  // Submissions
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'timestamp'>) => Submission;

  // AI Mentor Chat Sessions
  chatSessions: ChatSession[];
  activeChatSession: ChatSession | null;
  setActiveChatSessionId: (id: string) => void;
  createNewChatSession: (topic?: string, language?: Language, level?: StudentLevel) => ChatSession;
  addMessageToActiveChat: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Mock Interviews
  interviewSessions: InterviewSession[];
  saveInterviewSession: (session: InterviewSession) => void;

  // Coding Session Timer
  codingTimerSeconds: number;
  isTimerRunning: boolean;
  toggleTimer: () => void;
}

const DEFAULT_USER: User = {
  id: 'student-2026-aarav',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: 'Indian Institute of Information Technology',
  degree: 'B.Tech Computer Science & Engineering',
  year: '3rd Year',
  streak: 7,
  problemsSolved: 14,
  totalCodingMinutes: 380,
  topicProgress: {
    'Arrays': 75,
    'Strings & Stacks': 60,
    'Linked Lists': 50,
    'Dynamic Programming': 30,
    'Trees & BFS': 45,
    'Two Pointers & Stack': 25,
  },
  createdAt: '2026-08-15',
};

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    language: 'python',
    code: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []`,
    status: 'Accepted',
    runtimeMs: 48,
    memoryMb: 17.2,
    passedTests: 4,
    totalTests: 4,
    timestamp: '2026-09-18 14:32',
  },
  {
    id: 'sub-102',
    problemId: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    language: 'javascript',
    code: `function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}`,
    status: 'Accepted',
    runtimeMs: 52,
    memoryMb: 42.1,
    passedTests: 4,
    totalTests: 4,
    timestamp: '2026-09-18 17:15',
  },
  {
    id: 'sub-103',
    problemId: 'reverse-linked-list',
    problemTitle: 'Reverse Linked List',
    language: 'cpp',
    code: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr != nullptr) {\n            ListNode* nxt = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = nxt;\n        }\n        return prev;\n    }\n};`,
    status: 'Accepted',
    runtimeMs: 4,
    memoryMb: 9.8,
    passedTests: 3,
    totalTests: 3,
    timestamp: '2026-09-19 09:40',
  },
];

const INITIAL_CHAT_SESSION: ChatSession = {
  id: 'chat-001',
  title: 'Kadane’s Algorithm Intuition',
  topic: 'Dynamic Programming',
  language: 'python',
  level: 'intermediate',
  updatedAt: '15 mins ago',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Can you explain why Kadane\'s algorithm works in O(n) without checking all subarrays?',
      timestamp: '10:14 AM',
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: `### Kadane's Algorithm Intuition

Kadane's algorithm leverages a brilliant invariant:

At every index \`i\`, the maximum sum subarray ending at \`i\` is either:
1. **Extend previous subarray:** \`current_max + nums[i]\`
2. **Start fresh subarray:** Just \`nums[i]\` by itself (if \`current_max\` was dragging it down with negative debt).

Mathematically:
$$\\text{current\\_max} = \\max(\\text{nums}[i], \\text{current\\_max} + \\text{nums}[i])$$

Notice that we make a single pass through the array from left to right, maintaining \`current_max\` and updating our global \`max_so_far\`. Because each element is visited once and takes $O(1)$ comparisons, the overall time complexity is strictly **$O(N)$** with **$O(1)$** auxiliary space!`,
      timestamp: '10:15 AM',
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  // User State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('codementor_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Problems
  const [problems] = useState<Problem[]>(PROBLEMS);
  const [activeProblem, setActiveProblem] = useState<Problem>(PROBLEMS[0]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('codementor_solved_ids');
    return saved ? JSON.parse(saved) : ['two-sum', 'valid-parentheses', 'reverse-linked-list'];
  });

  // Submissions
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('codementor_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  // AI Mentor Chats
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('codementor_chats');
    return saved ? JSON.parse(saved) : [INITIAL_CHAT_SESSION];
  });
  const [activeChatSessionId, setActiveChatSessionId] = useState<string>(
    chatSessions[0]?.id || 'chat-001'
  );

  // Mock Interviews
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => {
    const saved = localStorage.getItem('codementor_interviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Coding Session Timer
  const [codingTimerSeconds, setCodingTimerSeconds] = useState<number>(1420);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setCodingTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('codementor_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('codementor_solved_ids', JSON.stringify(solvedProblemIds));
  }, [solvedProblemIds]);

  useEffect(() => {
    localStorage.setItem('codementor_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('codementor_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('codementor_interviews', JSON.stringify(interviewSessions));
  }, [interviewSessions]);

  // Actions
  const navigateTo = (page: AppPage, problemId?: string) => {
    if (problemId) {
      const p = problems.find((item) => item.id === problemId || item.slug === problemId);
      if (p) setActiveProblem(p);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email: string) => {
    const newUser: User = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    };
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const signup = (userData: { name: string; email: string; college: string; degree: string; year: string }) => {
    const newUser: User = {
      id: `student-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      college: userData.college || 'Engineering College',
      degree: userData.degree || 'B.Tech CSE',
      year: userData.year || '3rd Year',
      streak: 1,
      problemsSolved: 0,
      totalCodingMinutes: 10,
      topicProgress: {},
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codementor_user');
    setActivePage('landing');
  };

  const loginAsDemoStudent = () => {
    setUser(DEFAULT_USER);
    setAuthModalOpen(false);
  };

  const markProblemSolved = (problemId: string, language: Language, runtimeMs: number = 42) => {
    if (!solvedProblemIds.includes(problemId)) {
      setSolvedProblemIds((prev) => [...prev, problemId]);
      setUser((prev) => {
        if (!prev) return prev;
        const prob = problems.find((p) => p.id === problemId);
        const topic = prob?.topic || 'General';
        const currentProgress = prev.topicProgress[topic] || 0;
        return {
          ...prev,
          problemsSolved: prev.problemsSolved + 1,
          topicProgress: {
            ...prev.topicProgress,
            [topic]: Math.min(100, currentProgress + 25),
          },
        };
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch (e) {
        // ignore if not supported
      }
    }
  };

  const addSubmission = (subData: Omit<Submission, 'id' | 'timestamp'>): Submission => {
    const newSub: Submission = {
      ...subData,
      id: `sub-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSubmissions((prev) => [newSub, ...prev]);

    if (subData.status === 'Accepted') {
      markProblemSolved(subData.problemId, subData.language, subData.runtimeMs);
    }
    return newSub;
  };

  const activeChatSession =
    chatSessions.find((s) => s.id === activeChatSessionId) || chatSessions[0] || null;

  const createNewChatSession = (
    topic: string = 'General Algorithms',
    language: Language = 'python',
    level: StudentLevel = 'intermediate'
  ): ChatSession => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: `${topic} Discussion`,
      topic,
      language,
      level,
      updatedAt: 'Just now',
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'assistant',
          content: `Hello! I'm your **CodeMentor AI**. I'm here to guide you through **${topic}** in **${language.toUpperCase()}** at the **${level}** level.\n\nAsk me any concept, paste a tricky snippet for line-by-line breakdown, or ask for guided hints on your approach. What are you working on today?`,
          timestamp: 'Just now',
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatSessionId(newSession.id);
    return newSession;
  };

  const addMessageToActiveChat = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeChatSessionId) {
          return {
            ...s,
            updatedAt: 'Just now',
            messages: [...s.messages, fullMessage],
          };
        }
        return s;
      })
    );
  };

  const saveInterviewSession = (session: InterviewSession) => {
    setInterviewSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });
  };

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        navigateTo,
        user,
        login,
        signup,
        logout,
        loginAsDemoStudent,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        problems,
        activeProblem,
        setActiveProblem,
        solvedProblemIds,
        markProblemSolved,
        submissions,
        addSubmission,
        chatSessions,
        activeChatSession,
        setActiveChatSessionId,
        createNewChatSession,
        addMessageToActiveChat,
        interviewSessions,
        saveInterviewSession,
        codingTimerSeconds,
        isTimerRunning,
        toggleTimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

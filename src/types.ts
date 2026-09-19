export type Language = 'python' | 'javascript' | 'java' | 'cpp';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type StudentLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  college: string;
  degree: string;
  year: string;
  streak: number;
  problemsSolved: number;
  totalCodingMinutes: number;
  topicProgress: Record<string, number>; // topic -> percentage (0-100)
  createdAt: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  description: string;
  constraints: string[];
  hints: string[];
  examples: ProblemExample[];
  starterCodes: Record<Language, string>;
  starterTemplates?: Record<Language, string>;
  tags?: string[];
  testCases: TestCase[];
  acceptanceRate: string;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  language: Language;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Execution Pending';
  runtimeMs: number;
  memoryMb: number;
  passedTests: number;
  totalTests: number;
  timestamp: string;
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  language?: Language;
  hints?: string[];
  reasoningSteps?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  topic: string;
  language: Language;
  level: StudentLevel;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface CodeReviewResult {
  correctness: string;
  bugs: string[];
  timeComplexity: string;
  spaceComplexity: string;
  codeQualityScore: number; // 0 - 100
  readability: string;
  optimizationSuggestions: string[];
  learningSuggestions: string[];
  improvedCode?: string;
}

export interface DebugResult {
  likelyCause: string;
  problematicCode: string;
  fix: string;
  explanation: string;
  preventionTips: string[];
  correctedCodeSnippet?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  interviewerNote?: string;
  studentAnswer?: string;
  feedback?: string;
  score?: number;
}

export interface InterviewTurn {
  questionNumber: number;
  question: string;
  studentAnswer?: string;
  feedback?: string;
  score?: number; // 0 - 10
}

export interface InterviewReport {
  overallScore: number; // 0 - 100
  technicalCompetence: string;
  problemSolving: string;
  codeQuality: string;
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
}

export interface InterviewSession {
  id: string;
  topic: string;
  targetRole: string;
  difficulty: Difficulty | string;
  date?: string;
  turns?: InterviewTurn[];
  questions?: InterviewQuestion[];
  overallScore?: number;
  finalFeedback?: string;
  status?: 'in_progress' | 'completed';
  finalReport?: InterviewReport;
  createdAt?: string;
}

export interface CodeExecutionResult {
  status: 'success' | 'failed' | 'simulated';
  provider: string;
  output: string;
  testResults: {
    testCaseId: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
  runtimeMs: number;
  memoryMb: number;
  note: string;
}

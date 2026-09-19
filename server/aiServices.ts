import { GoogleGenAI, Type } from '@google/genai';

/**
 * Server-side Gemini AI service for CodeMentor AI
 * Model: gemini-3.8-flash (official recommendation for high quality coding & reasoning)
 */
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set. Gemini calls will fail unless configured.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const DEFAULT_MODEL = 'gemini-3.8-flash';

/**
 * 1. AI Coding Mentor
 * Socratic, pedagogical coding assistant tailored for college / B.Tech students.
 */
export async function askCodingMentor(params: {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  language?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  problemContext?: string;
}) {
  const ai = getAiClient();
  const { messages, language = 'python', level = 'intermediate', problemContext } = params;

  const systemInstruction = `You are "CodeMentor AI", an empathetic, elite Computer Science professor and coding mentor for college & engineering (B.Tech) students.
Your mission is to help students truly master algorithms, data structures, and software engineering.

Core Principles:
1. Socratic Teaching: Prefer conceptual clarity, progressive hints, and guided reasoning over dumping full answers immediately, unless the student explicitly asks "show me the full code" or is completely stuck.
2. Structure: Break down complex concepts with clear analogies, step-by-step logic, and time/space complexity analysis.
3. Language: Default to ${language} syntax when providing code snippets, but support C++, Java, Python, and JavaScript.
4. Audience Level: Adapt explanation for a ${level} student:
   - beginner: Explain syntax, edge cases, variables, and line-by-line intuition without intimidating jargon.
   - intermediate: Focus on time/space tradeoffs, standard patterns (two pointers, sliding window, DP state transitions), and clean code.
   - advanced: Discuss memory layout, cache locality, amortized complexity, and scalable idioms.
5. Formatting: Use GitHub-flavored markdown with clean syntax-highlighted code blocks, bold key terms, and bullet points.
${problemContext ? `Active Problem Context:\n${problemContext}` : ''}
`;

  // Format conversation history for Gemini
  const conversation = messages.map((m) => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.content}`).join('\n\n');

  const prompt = `${conversation}\n\nMentor:`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return {
    reply: response.text || 'I could not generate a response. Please try again.',
  };
}

/**
 * 2. Progressive Hint Generator
 * Returns progressive, targeted hints without spoiling the entire solution.
 */
export async function generateHint(params: {
  problemTitle: string;
  problemDescription: string;
  studentCode?: string;
  language: string;
  hintLevel: number; // 1 = nudge, 2 = strategy, 3 = algorithmic breakdown
}) {
  const ai = getAiClient();
  const { problemTitle, problemDescription, studentCode, language, hintLevel } = params;

  const prompt = `Problem: ${problemTitle}
Description:
${problemDescription}

Student's current language: ${language}
${studentCode ? `Student's Current Code Attempt:\n\`\`\`${language}\n${studentCode}\n\`\`\`` : ''}

Task: Provide Hint Level ${hintLevel} out of 3:
- Level 1: Gentle Conceptual Nudge (identify which data structure or invariant to observe without naming algorithm).
- Level 2: Algorithmic Strategy (suggest approach like two-pointers, hash map, prefix sum, or recursion relation).
- Level 3: Detailed Step-by-Step Pseudocode outline (still DO NOT provide full copy-paste solution code).

Return JSON with:
{
  "hintLevel": ${hintLevel},
  "title": "Short title for this hint",
  "guidance": "Clear, encouraging explanation for the student",
  "guidingQuestion": "A question to prompt the student to think"
}`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.5,
    },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return {
      hintLevel,
      title: `Hint ${hintLevel}`,
      guidance: response.text || 'Think about the problem constraints and edge cases.',
      guidingQuestion: 'What data structure gives you O(1) lookups?',
    };
  }
}

/**
 * 3. AI Code Review
 * Deep static inspection returning structured JSON feedback.
 */
export async function reviewCode(params: {
  code: string;
  language: string;
  problemContext?: string;
}) {
  const ai = getAiClient();
  const { code, language, problemContext } = params;

  const prompt = `Perform a comprehensive professional code review on the following ${language} code.
${problemContext ? `Problem Context:\n${problemContext}\n` : ''}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Evaluate for:
1. Correctness: Does it solve the problem? Are there edge cases missed (empty inputs, negative values, integer overflows)?
2. Bugs: Specific potential or actual bugs identified.
3. Time Complexity: Big-O analysis with explanation.
4. Space Complexity: Auxiliary memory analysis.
5. Code Quality Score: Integer from 0 to 100 based on efficiency, readability, naming conventions, and idiomatic practices.
6. Readability: Assessment of variable naming, indentation, and structure.
7. Optimization Suggestions: Specific ways to improve time/space efficiency.
8. Learning Suggestions: Relevant computer science concepts, design patterns, or library functions the student should study.
9. Improved Code: Clean, refactored version of the code with comments explaining the enhancements.`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctness: { type: Type.STRING, description: 'Evaluation of correctness and edge-case handling' },
          bugs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of potential or confirmed bugs',
          },
          timeComplexity: { type: Type.STRING, description: 'Big-O time complexity and why' },
          spaceComplexity: { type: Type.STRING, description: 'Big-O space complexity and why' },
          codeQualityScore: { type: Type.INTEGER, description: 'Score from 0 to 100' },
          readability: { type: Type.STRING, description: 'Evaluation of formatting, clarity, and idioms' },
          optimizationSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Actionable optimizations',
          },
          learningSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Concepts and topics to learn',
          },
          improvedCode: { type: Type.STRING, description: 'Refactored clean code implementation' },
        },
        required: [
          'correctness',
          'bugs',
          'timeComplexity',
          'spaceComplexity',
          'codeQualityScore',
          'readability',
          'optimizationSuggestions',
          'learningSuggestions',
        ],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  return parsed;
}

/**
 * 4. AI Debugger
 * Pinpoint root cause, problematic line, clean fix, and prevention advice.
 */
export async function debugCode(params: {
  language: string;
  code: string;
  errorMessage?: string;
  expectedBehavior?: string;
}) {
  const ai = getAiClient();
  const { language, code, errorMessage, expectedBehavior } = params;

  const prompt = `You are an expert compiler and runtime debugger. A student is encountering a bug in their ${language} program.

Code:
\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error Message / Stack Trace / Wrong Output:\n${errorMessage}\n` : ''}
${expectedBehavior ? `Expected Behavior:\n${expectedBehavior}\n` : ''}

Diagnose:
1. likelyCause: Exact root cause of the bug (e.g. off-by-one error, null reference, unhandled edge case, stack overflow, variable shadowing).
2. problematicCode: The specific snippet or line(s) causing the failure.
3. fix: Clear description of how to rectify the issue.
4. explanation: Student-friendly conceptual explanation of why this bug happens in ${language}.
5. preventionTips: 3-4 bullet points on how to prevent similar errors in future code and technical interviews.
6. correctedCodeSnippet: The complete, corrected version of the code.`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          likelyCause: { type: Type.STRING },
          problematicCode: { type: Type.STRING },
          fix: { type: Type.STRING },
          explanation: { type: Type.STRING },
          preventionTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctedCodeSnippet: { type: Type.STRING },
        },
        required: ['likelyCause', 'problematicCode', 'fix', 'explanation', 'preventionTips', 'correctedCodeSnippet'],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

/**
 * 5. Code Explanation (line-by-line / concept breakdown)
 */
export async function explainCode(params: {
  code: string;
  language: string;
  depth?: 'high_level' | 'line_by_line' | 'complexity';
}) {
  const ai = getAiClient();
  const { code, language, depth = 'line_by_line' } = params;

  const prompt = `Analyze and explain this ${language} code for an engineering college student.
Depth requested: ${depth}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. High-level summary of what the code achieves.
2. Step-by-step or line-by-line walkthrough of the key logic.
3. Time and space complexity breakdown.
4. Key programming principles demonstrated.`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      temperature: 0.4,
    },
  });

  return {
    explanation: response.text || 'Unable to explain code at this time.',
  };
}

/**
 * 6. AI Mock Technical Interview
 * Dynamic interviewer asking 1 question at a time, evaluating responses, and finalizing reports.
 */
export async function conductInterview(params: {
  action: 'start' | 'evaluate_and_next' | 'finalize';
  topic: string;
  difficulty: string;
  targetRole: string;
  history?: { question: string; studentAnswer: string; feedback?: string; score?: number }[];
  latestAnswer?: string;
}) {
  const ai = getAiClient();
  const { action, topic, difficulty, targetRole, history = [], latestAnswer } = params;

  if (action === 'start') {
    const prompt = `You are a Senior Technical Interviewer conducting a mock interview for a ${targetRole} role.
Topic: ${topic}
Difficulty: ${difficulty}

Task: Formulate the very FIRST technical interview question.
Make it engaging, realistic, and relevant to college campus placements / technical screenings.
Return JSON:
{
  "questionNumber": 1,
  "question": "The interview question text",
  "interviewerNote": "What this question assesses"
}`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  }

  if (action === 'evaluate_and_next') {
    const prompt = `You are a Senior Technical Interviewer for a ${targetRole} role.
Topic: ${topic}
Difficulty: ${difficulty}

Interview History so far:
${history.map((h, i) => `Q${i + 1}: ${h.question}\nStudent Answer: ${h.studentAnswer}`).join('\n\n')}

Latest Student Answer to the most recent question:
"${latestAnswer}"

Task:
1. Evaluate the student's answer (score 1-10, strengths, gaps in technical reasoning or communication).
2. Propose the NEXT follow-up or new question (Question #${history.length + 1}), escalating depth or testing edge cases.

Return JSON:
{
  "feedback": "Concise feedback on the student's answer",
  "score": 8,
  "nextQuestionNumber": ${history.length + 1},
  "nextQuestion": "The next interview question",
  "isFinalQuestion": ${history.length >= 3}
}`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  }

  // action === 'finalize'
  const prompt = `You are the Lead Hiring Committee chair reviewing a completed mock interview for a ${targetRole} candidate.
Topic: ${topic}
Difficulty: ${difficulty}

Complete Interview Transcript:
${history.map((h, i) => `Q${i + 1}: ${h.question}\nStudent Answer: ${h.studentAnswer}\nFeedback: ${h.feedback || 'Evaluated'}\nScore: ${h.score || 7}/10`).join('\n\n')}

Task: Synthesize a comprehensive final interview performance report card.
Return JSON:
{
  "overallScore": 85,
  "technicalCompetence": "Solid understanding of DSA primitives and algorithms",
  "problemSolving": "Methodical approach, successfully identified optimal complexities",
  "codeQuality": "Clean mental models, communicates trade-offs well",
  "strengths": ["Clear communication", "Recognized sliding window pattern quickly", "Good complexity analysis"],
  "areasForImprovement": ["Be careful with empty array edge cases", "State space complexity explicitly upfront"],
  "summary": "Overall strong candidate ready for university campus recruitment technical rounds with minor polish on boundary testing."
}`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return JSON.parse(response.text || '{}');
}

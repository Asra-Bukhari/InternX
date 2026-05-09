const Groq = require("groq-sdk");
const SkillTest = require("../models/SkillTest");
const Profile = require("../models/Profile");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Helper: call Groq and parse JSON safely ──────────────────────────────────
async function callGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a technical evaluator. You always respond with valid JSON only — no markdown, no explanation, no code fences, just the raw JSON object.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── 1. Generate Voluntary Skill Badge Test ───────────────────────────────────
// POST /api/ai/generate-skill-test
// Body: { studentId, skillTopic }
const generateSkillTest = async (req, res) => {
  try {
    const { studentId, skillTopic } = req.body;

    if (!studentId || !skillTopic) {
      return res.status(400).json({ message: "studentId and skillTopic are required." });
    }

    const prompt = `
Generate a skill assessment test for the topic: "${skillTopic}".

The test must have exactly 10 questions with this exact distribution:
- 4 MCQ questions (4 options each, one correct — include tricky distractors)
- 3 short answer questions (require explanation of concepts, not just definitions — make them tricky)
- 3 coding questions (practical problems — write actual code, not pseudocode)

Return a JSON object in this exact format:
{
  "questions": [
    {
      "questionText": "...",
      "type": "mcq",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ..."
    },
    {
      "questionText": "Explain why ... and what happens when ...",
      "type": "short_answer",
      "options": [],
      "correctAnswer": "Key points: ..."
    },
    {
      "questionText": "Write a function that ...",
      "type": "coding",
      "options": [],
      "correctAnswer": "Expected approach: ..."
    }
  ]
}

Guidelines:
- MCQs must have plausible wrong options that test real understanding
- Short answers must require reasoning, not just recall
- Coding questions must be practical and solvable in 5-10 minutes
- All questions must be directly relevant to "${skillTopic}"
- Appropriate difficulty for a university student
`;

    const parsed = await callGroq(prompt);

    const test = await SkillTest.create({
      studentId,
      testType: "skill_badge",
      skillTopic,
      questions: parsed.questions,
      status: "generated",
    });

    // Never send correctAnswer to frontend
    const safeQuestions = test.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
    }));

    res.status(201).json({
      message: "Skill test generated successfully.",
      testId: test._id,
      skillTopic: test.skillTopic,
      questions: safeQuestions,
    });
  } catch (err) {
    console.error("generateSkillTest error:", err);
    res.status(500).json({ message: "Failed to generate skill test.", error: err.message });
  }
};

// ─── 2. Generate Project Application Test ────────────────────────────────────
// POST /api/ai/generate-project-test
// Body: { studentId, projectId, projectTitle, projectDescription, skillsRequired }
const generateProjectTest = async (req, res) => {
  try {
    const { studentId, projectId, projectTitle, projectDescription, skillsRequired } = req.body;

    if (!studentId || !projectId || !projectDescription) {
      return res.status(400).json({ message: "studentId, projectId, and projectDescription are required." });
    }

    const skillsList = Array.isArray(skillsRequired)
      ? skillsRequired.join(", ")
      : skillsRequired || "general";

    const prompt = `
A student is applying for the following internship project:

Project Title: "${projectTitle}"
Project Description: "${projectDescription}"
Required Skills: ${skillsList}

Generate a focused skill assessment test with exactly 10 questions to evaluate if the student can handle this project.

Exact distribution:
- 4 MCQ questions (4 options each — directly test the required skills, use tricky distractors)
- 3 short answer questions (require reasoning about the project domain — not just definitions)
- 3 coding questions (practical, based on what they would actually do in this project)

Return a JSON object in this exact format:
{
  "questions": [
    {
      "questionText": "...",
      "type": "mcq",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ..."
    },
    {
      "questionText": "...",
      "type": "short_answer",
      "options": [],
      "correctAnswer": "Key points: ..."
    },
    {
      "questionText": "Write a function that ...",
      "type": "coding",
      "options": [],
      "correctAnswer": "Expected approach: ..."
    }
  ]
}

Guidelines:
- Questions must be tightly scoped to the project requirements
- MCQs must test practical knowledge, not trivia
- Coding questions should reflect real tasks in the project
- Short answers must require reasoning, not just definitions
`;

    const parsed = await callGroq(prompt);

    const test = await SkillTest.create({
      studentId,
      testType: "project_application",
      projectId,
      skillTopic: projectTitle,
      questions: parsed.questions,
      status: "generated",
    });

    const safeQuestions = test.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
    }));

    res.status(201).json({
      message: "Project application test generated successfully.",
      testId: test._id,
      projectId: test.projectId,
      questions: safeQuestions,
    });
  } catch (err) {
    console.error("generateProjectTest error:", err);
    res.status(500).json({ message: "Failed to generate project test.", error: err.message });
  }
};

// ─── 3. Submit & Evaluate Test ────────────────────────────────────────────────
// POST /api/ai/evaluate-test
// Body: { testId, answers: { "0": "answer", "1": "answer", ... } }
const evaluateTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;

    if (!testId || !answers) {
      return res.status(400).json({ message: "testId and answers are required." });
    }

    const test = await SkillTest.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found." });
    if (test.status === "evaluated") {
      return res.status(400).json({ message: "This test has already been evaluated." });
    }

    // Build Q&A pairs for the LLM
    const qaList = test.questions.map((q, i) => ({
      index: i,
      questionText: q.questionText,
      type: q.type,
      correctAnswer: q.correctAnswer,
      studentAnswer: answers[i] ?? answers[String(i)] ?? "(no answer)",
    }));

    const prompt = `
Evaluate the student's answers to the following 10 test questions.

${JSON.stringify(qaList, null, 2)}

Scoring rules:
- Total score is out of 100. Each question is worth 10 points.
- MCQ: 10 points if correct, 0 if wrong — no partial marks
- short_answer: 0-10 based on how many key concepts are correctly explained
- coding: 0-10 based on correctness, logic, edge case handling, and code quality
- Passing score is 50 out of 100

Return a JSON object in this exact format:
{
  "score": <number 0-100>,
  "passed": <true if score >= 50, false otherwise>,
  "perQuestion": [
    { "index": 0, "marks": <0-10>, "comment": "brief comment" },
    { "index": 1, "marks": <0-10>, "comment": "brief comment" },
    { "index": 2, "marks": <0-10>, "comment": "brief comment" },
    { "index": 3, "marks": <0-10>, "comment": "brief comment" },
    { "index": 4, "marks": <0-10>, "comment": "brief comment" },
    { "index": 5, "marks": <0-10>, "comment": "brief comment" },
    { "index": 6, "marks": <0-10>, "comment": "brief comment" },
    { "index": 7, "marks": <0-10>, "comment": "brief comment" },
    { "index": 8, "marks": <0-10>, "comment": "brief comment" },
    { "index": 9, "marks": <0-10>, "comment": "brief comment" }
  ],
  "overallFeedback": "2-3 sentence constructive feedback for the student."
}
`;

    const evaluation = await callGroq(prompt);

    // Persist results
    test.submittedAnswers = answers;
    test.score = evaluation.score;
    test.passed = evaluation.passed;
    test.feedback = evaluation.overallFeedback;
    test.status = "evaluated";
    await test.save();

    // Award skill badge if voluntary test passed
    if (test.passed && test.testType === "skill_badge") {
      await Profile.findOneAndUpdate(
        { userId: test.studentId },
        { $addToSet: { skillBadges: test.skillTopic } }
      );
    }

    res.status(200).json({
      message: "Test evaluated successfully.",
      testId: test._id,
      score: evaluation.score,
      passed: evaluation.passed,
      perQuestion: evaluation.perQuestion,
      overallFeedback: evaluation.overallFeedback,
      ...(test.testType === "skill_badge" && test.passed
        ? { badgeAwarded: test.skillTopic }
        : {}),
    });
  } catch (err) {
    console.error("evaluateTest error:", err);
    res.status(500).json({ message: "Failed to evaluate test.", error: err.message });
  }
};

// ─── 4. Get test by ID ────────────────────────────────────────────────────────
// GET /api/ai/test/:testId
const getTest = async (req, res) => {
  try {
    const test = await SkillTest.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found." });

    const safeQuestions = test.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
    }));

    res.status(200).json({
      testId: test._id,
      testType: test.testType,
      skillTopic: test.skillTopic,
      status: test.status,
      questions: safeQuestions,
      ...(test.status === "evaluated"
        ? { score: test.score, passed: test.passed, feedback: test.feedback }
        : {}),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch test.", error: err.message });
  }
};

module.exports = { generateSkillTest, generateProjectTest, evaluateTest, getTest };
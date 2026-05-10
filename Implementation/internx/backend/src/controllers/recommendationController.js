const Groq = require("groq-sdk");
const Profile = require("../models/Profile");
const Project = require("../models/Project");
const Application = require("../models/Application");
const SkillTest = require("../models/SkillTest");
const User = require("../models/User");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Helper: call Groq ────────────────────────────────────────────────────────
async function callGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a recommendation engine. You always respond with valid JSON only — no markdown, no explanation, no code fences, just the raw JSON object.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3, // lower = more consistent ranking
    max_tokens: 2000,
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── 1. Recommend Projects to a Student ──────────────────────────────────────
// GET /api/recommendations/projects/:studentId
const recommendProjects = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch student profile
    const profile = await Profile.findOne({ userId: studentId });
    if (!profile) {
      return res.status(404).json({ message: "Student profile not found." });
    }

    // Fetch student's test history (evaluated tests only)
    const testHistory = await SkillTest.find({
      studentId,
      status: "evaluated",
    }).select("skillTopic score passed testType");

    // Fetch projects student already applied to (exclude them)
    const existingApplications = await Application.find({ studentId }).select("projectId");
    const appliedProjectIds = existingApplications.map((a) => a.projectId.toString());

    // Fetch all open projects not already applied to
    const openProjects = await Project.find({
      status: "open",
      _id: { $nin: appliedProjectIds },
    }).select("_id title description skillsRequired difficulty contractType");

    if (openProjects.length === 0) {
      return res.status(200).json({ recommendations: [], message: "No open projects available." });
    }

    // Build student summary for Groq
    const studentSummary = {
      skills: profile.skills || [],
      skillBadges: profile.skillBadges || [],
      degree: profile.degree,
      semester: profile.semester,
      completedProjects: profile.completedProjects,
      rating: profile.rating,
      testHistory: testHistory.map((t) => ({
        topic: t.skillTopic,
        score: t.score,
        passed: t.passed,
      })),
    };

    const projectList = openProjects.map((p) => ({
      projectId: p._id,
      title: p.title,
      description: p.description,
      skillsRequired: p.skillsRequired,
      difficulty: p.difficulty,
      contractType: p.contractType,
    }));

    const prompt = `
You are a smart project recommendation engine for a student internship platform.

Student Profile:
${JSON.stringify(studentSummary, null, 2)}

Available Projects:
${JSON.stringify(projectList, null, 2)}

Task: Rank the top 5 most suitable projects for this student based on:
1. Skill match — how well student's skills and badges align with required skills
2. Test performance — if student has taken relevant tests, factor in their scores
3. Experience level — match project difficulty with student's semester and completed projects
4. Overall fit — consider description and student background holistically

Return a JSON object in this exact format:
{
  "recommendations": [
    {
      "projectId": "...",
      "title": "...",
      "matchScore": <number 0-100>,
      "reason": "1-2 sentence explanation of why this project suits the student"
    }
  ]
}

Return at most 5 recommendations, ordered from best to worst match.
Only include projects where matchScore >= 30.
`;

    const result = await callGroq(prompt);

    // Enrich with full project details
    const enriched = result.recommendations.map((rec) => {
      const project = openProjects.find(
        (p) => p._id.toString() === rec.projectId.toString()
      );
      return {
        ...rec,
        project: project || null,
      };
    });

    res.status(200).json({
      studentId,
      recommendations: enriched,
    });
  } catch (err) {
    console.error("recommendProjects error:", err);
    res.status(500).json({ message: "Failed to get project recommendations.", error: err.message });
  }
};

// ─── 2. Recommend Top Applicants to a Business ───────────────────────────────
// GET /api/recommendations/applicants/:projectId
const recommendApplicants = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch project details
    const project = await Project.findById(projectId).select(
      "title description skillsRequired difficulty"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Fetch all pending applications for this project
    const applications = await Application.find({
      projectId,
      status: "pending",
    }).populate("studentId", "name email");

    if (applications.length === 0) {
      return res.status(200).json({ recommendations: [], message: "No applicants yet." });
    }

    // Build applicant summaries
    const applicantSummaries = await Promise.all(
      applications.map(async (app) => {
        const profile = await Profile.findOne({ userId: app.studentId._id });

        // Get their project application test score
        let testScore = null;
        let testPassed = null;
        if (app.testId) {
          const test = await SkillTest.findById(app.testId).select("score passed");
          if (test) {
            testScore = test.score;
            testPassed = test.passed;
          }
        } else {
          // Fallback: find test by studentId + projectId
          const test = await SkillTest.findOne({
            studentId: app.studentId._id,
            projectId,
            status: "evaluated",
          }).select("score passed");
          if (test) {
            testScore = test.score;
            testPassed = test.passed;
          }
        }

        return {
          applicationId: app._id,
          studentId: app.studentId._id,
          name: app.studentId.name,
          skills: profile?.skills || [],
          skillBadges: profile?.skillBadges || [],
          degree: profile?.degree,
          semester: profile?.semester,
          completedProjects: profile?.completedProjects || 0,
          rating: profile?.rating || 0,
          testScore,
          testPassed,
        };
      })
    );

    const projectSummary = {
      title: project.title,
      description: project.description,
      skillsRequired: project.skillsRequired,
      difficulty: project.difficulty,
    };

    const prompt = `
You are a smart applicant ranking engine for a student internship platform.

Project Details:
${JSON.stringify(projectSummary, null, 2)}

Applicants:
${JSON.stringify(applicantSummaries, null, 2)}

Task: Rank all applicants from best to worst fit for this project based on:
1. Skill match — how well their skills and badges match the required skills
2. Test score — higher score = better (testPassed = true is important)
3. Experience — completed projects and rating
4. Academic level — semester and degree relevance

Return a JSON object in this exact format:
{
  "recommendations": [
    {
      "applicationId": "...",
      "studentId": "...",
      "name": "...",
      "matchScore": <number 0-100>,
      "reason": "1-2 sentence explanation of why this applicant ranks here"
    }
  ]
}

Include ALL applicants in the ranking, ordered from best to worst.
`;

    const result = await callGroq(prompt);

    res.status(200).json({
      projectId,
      projectTitle: project.title,
      totalApplicants: applications.length,
      recommendations: result.recommendations,
    });
  } catch (err) {
    console.error("recommendApplicants error:", err);
    res.status(500).json({ message: "Failed to get applicant recommendations.", error: err.message });
  }
};

module.exports = { recommendProjects, recommendApplicants };
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
const Deliverable = require("../models/Deliverable");
const Review = require("../models/Review");
const SkillTest = require("../models/SkillTest");
require("dotenv").config();

async function seedAdditional() {
  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash("123456", 10);

  // ─── 1. GET EXISTING USERS ─────────────────────────────────────────────
  const asra = await User.findOne({ email: "student@internx.com" });
  const ali = await User.findOne({ email: "business@internx.com" });

  if (!asra || !ali) {
    console.log("Existing seed data not found. Run seed.js first.");
    process.exit(1);
  }

  // ─── 2. UPDATE EXISTING RECORDS WITH MISSING FIELDS ───────────────────
  // Update Asra's profile with skillBadges
  const asraProfile = await Profile.findOne({ userId: asra._id });
  if (asraProfile) {
    let changed = false;
    if (!asraProfile.skillBadges || asraProfile.skillBadges.length === 0) {
      asraProfile.skillBadges = ["React", "Node.js", "MongoDB"];
      changed = true;
    }
    if (!asraProfile.availability || !asraProfile.availability.startDate) {
      asraProfile.availability = { startDate: new Date(), endDate: new Date() };
      changed = true;
    }
    if (changed) await asraProfile.save();
  }

  // Update existing project with full details
  const existingProject = await Project.findOne({ title: "Fullstack E-commerce Dashboard" });
  if (existingProject && !existingProject.summary) {
    existingProject.summary = "A comprehensive e-commerce dashboard with analytics and inventory management";
    existingProject.category = "Web Development";
    existingProject.durationLabel = "3 Months";
    existingProject.hoursPerDay = "4-5";
    existingProject.budget = 2000;
    existingProject.paymentNotes = "50% upfront milestone, 50% on completion";
    existingProject.deliverables = [
      { title: "Dashboard UI", description: "React-based admin dashboard with charts", deadline: "Month 1", paymentPercent: 30 },
      { title: "API Integration", description: "Backend API with JWT auth and role-based access", deadline: "Month 2", paymentPercent: 40 },
      { title: "Deployment & Testing", description: "Deploy to production with CI/CD pipeline", deadline: "Month 3", paymentPercent: 30 },
    ];
    await existingProject.save();
  }

  // ─── 3. CREATE NEW USERS ──────────────────────────────────────────────
  const userData = [
    { name: "Zain Ahmed", email: "zain@internx.com", role: "student", isVerified: true },
    { name: "Hira Khan", email: "hira@internx.com", role: "student", isVerified: true },
    { name: "Sara Ali", email: "sara@internx.com", role: "student", isVerified: true },
    { name: "Usman Tariq", email: "usman@internx.com", role: "student", isVerified: false },
    { name: "Omar Farooq", email: "omar@internx.com", role: "business", isVerified: true },
    { name: "Fatima Sheikh", email: "fatima@internx.com", role: "business", isVerified: true },
  ];

  const createdUsers = [];
  for (const u of userData) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      createdUsers.push(existing);
    } else {
      const user = await User.create({ ...u, password: hash });
      createdUsers.push(user);
    }
  }

  const [zain, hira, sara, usman, omar, fatima] = createdUsers;

  // ─── 4. PROFILES ──────────────────────────────────────────────────────
  // Zain: high-skilled student with badges + lots of experience
  if (!(await Profile.exists({ userId: zain._id }))) {
    await Profile.create({
      userId: zain._id,
      university: "FAST NUCES",
      degree: "BS Artificial Intelligence",
      semester: "8",
      skills: ["Python", "TensorFlow", "OpenCV", "NLP", "Docker"],
      availability: { startDate: new Date("2026-06-01"), endDate: new Date("2026-12-31") },
      completedProjects: 3,
      rating: 4.8,
      skillBadges: ["Python", "AI/ML"],
    });
  }

  // Hira: mid-level student with some experience
  if (!(await Profile.exists({ userId: hira._id }))) {
    await Profile.create({
      userId: hira._id,
      university: "NUST",
      degree: "BS Data Science",
      semester: "6",
      skills: ["Python", "Pandas", "SQL", "Tableau"],
      availability: { startDate: new Date("2026-05-15"), endDate: new Date("2026-11-30") },
      completedProjects: 1,
      rating: 4.2,
      skillBadges: ["Python"],
    });
  }

  // Sara: junior student, just completed her first project
  if (!(await Profile.exists({ userId: sara._id }))) {
    await Profile.create({
      userId: sara._id,
      university: "LUMS",
      degree: "BS Computer Science",
      semester: "4",
      skills: ["HTML", "CSS", "JavaScript", "Figma"],
      availability: { startDate: new Date("2026-05-01"), endDate: new Date("2026-09-30") },
      completedProjects: 1,
      rating: 4.0,
      skillBadges: ["UI/UX"],
    });
  }

  // Usman intentionally has NO profile (edge case: student with no profile)

  // ─── 5. PROJECTS ──────────────────────────────────────────────────────
  // ── Project A: AI Chatbot Integration (open, has pending applicant) ──
  let aiChatbot = await Project.findOne({ title: "AI Chatbot Integration" });
  if (!aiChatbot) {
    aiChatbot = await Project.create({
      businessId: omar._id,
      title: "AI Chatbot Integration",
      summary: "Integrate an AI-powered chatbot into an existing e-commerce platform",
      description: "We need a developer to integrate a conversational AI chatbot using OpenAI API. The chatbot should handle customer queries, product recommendations, and order tracking.",
      category: "AI / Machine Learning",
      skillsRequired: ["Python", "OpenAI API", "Node.js", "React"],
      difficulty: "hard",
      contractType: "fixed",
      durationLabel: "2 Months",
      hoursPerDay: "5-6",
      budget: 1500,
      paymentNotes: "Milestone-based: 40% on backend, 40% on frontend, 20% on testing",
      deliverables: [
        { title: "Chatbot Backend", description: "API endpoints for chatbot conversation logic", deadline: "Week 3", paymentPercent: 40 },
        { title: "Frontend Integration", description: "Chat widget embedded into existing storefront", deadline: "Week 6", paymentPercent: 40 },
        { title: "Testing & Deployment", description: "End-to-end testing, load testing, production deployment", deadline: "Week 8", paymentPercent: 20 },
      ],
      applicants: [zain._id],
      status: "open",
    });
  }

  // ── Project B: Mobile App UI Design (completed, has accepted student) ──
  let mobileApp = await Project.findOne({ title: "Mobile App UI Design" });
  if (!mobileApp) {
    mobileApp = await Project.create({
      businessId: fatima._id,
      title: "Mobile App UI Design",
      summary: "Design a modern mobile app UI for a fitness tracking application",
      description: "We are building a fitness tracking app called FitTrack. We need a UI designer to create wireframes, high-fidelity mockups, and a comprehensive design system covering workouts, nutrition tracking, and progress dashboards.",
      category: "UI/UX Design",
      skillsRequired: ["Figma", "UI/UX", "Design Systems"],
      difficulty: "easy",
      contractType: "fixed",
      durationLabel: "1 Month",
      hoursPerDay: "3-4",
      budget: 800,
      paymentNotes: "Full payment on delivery upon approval of all deliverables",
      deliverables: [
        { title: "Wireframes", description: "Low-fidelity wireframes for all 12 screens", deadline: "Week 1", paymentPercent: 30 },
        { title: "High-fidelity Mockups", description: "Pixel-perfect mockups in Figma with interactive prototypes", deadline: "Week 3", paymentPercent: 50 },
        { title: "Design System", description: "Color palette, typography, iconography, and component library", deadline: "Week 4", paymentPercent: 20 },
      ],
      applicants: [sara._id],
      selectedStudent: sara._id,
      status: "completed",
    });
  } else if (mobileApp.status !== "completed" || !mobileApp.selectedStudent) {
    // Fix existing record if it has wrong state
    mobileApp.businessId = fatima._id;
    mobileApp.summary = "Design a modern mobile app UI for a fitness tracking application";
    mobileApp.description = "We are building a fitness tracking app called FitTrack. We need a UI designer to create wireframes, high-fidelity mockups, and a comprehensive design system covering workouts, nutrition tracking, and progress dashboards.";
    mobileApp.category = "UI/UX Design";
    mobileApp.skillsRequired = ["Figma", "UI/UX", "Design Systems"];
    mobileApp.difficulty = "easy";
    mobileApp.contractType = "fixed";
    mobileApp.durationLabel = "1 Month";
    mobileApp.hoursPerDay = "3-4";
    mobileApp.budget = 800;
    mobileApp.paymentNotes = "Full payment on delivery upon approval of all deliverables";
    mobileApp.deliverables = [
      { title: "Wireframes", description: "Low-fidelity wireframes for all 12 screens", deadline: "Week 1", paymentPercent: 30 },
      { title: "High-fidelity Mockups", description: "Pixel-perfect mockups in Figma with interactive prototypes", deadline: "Week 3", paymentPercent: 50 },
      { title: "Design System", description: "Color palette, typography, iconography, and component library", deadline: "Week 4", paymentPercent: 20 },
    ];
    mobileApp.applicants = [sara._id];
    mobileApp.selectedStudent = sara._id;
    mobileApp.status = "completed";
    await mobileApp.save();
  }

  // ── Project C: Data Analysis with Python (open, hourly, no applicants) ──
  let dataAnalysis = await Project.findOne({ title: "Data Analysis with Python" });
  if (!dataAnalysis) {
    dataAnalysis = await Project.create({
      businessId: omar._id,
      title: "Data Analysis with Python",
      summary: "Analyze quarterly sales data and build interactive dashboards",
      description: "We need a data analyst to clean, process, and visualize our quarterly sales data. Build interactive dashboards using Python and create comprehensive reports with actionable insights.",
      category: "Data Science",
      skillsRequired: ["Python", "Pandas", "Tableau", "SQL"],
      difficulty: "medium",
      contractType: "hourly",
      durationLabel: "3 Months",
      hoursPerDay: "3-4",
      budget: 30,
      paymentNotes: "Weekly payout based on hours logged via the platform",
      deliverables: [
        { title: "Data Cleaning & Preparation", description: "Cleaned and processed dataset with documentation", deadline: "Week 2", paymentPercent: 30 },
        { title: "Interactive Dashboard", description: "Tableau/PowerBI dashboard with filters and drill-downs", deadline: "Week 8", paymentPercent: 50 },
        { title: "Final Report", description: "Summary of key insights, trends, and recommendations", deadline: "Week 12", paymentPercent: 20 },
      ],
      status: "open",
    });
  }

  // ── Project D: Content Writing for Tech Blog (open, hourly, no applicants) ──
  let contentWriting = await Project.findOne({ title: "Content Writing for Tech Blog" });
  if (!contentWriting) {
    contentWriting = await Project.create({
      businessId: fatima._id,
      title: "Content Writing for Tech Blog",
      summary: "Write weekly tech articles on AI, web development, and startup trends",
      description: "We run a tech blog with 50k monthly readers. We need a content writer to produce high-quality, well-researched, SEO-optimized articles. Topics include AI/ML, web dev, startup stories, and tech tutorials.",
      category: "Content Writing",
      skillsRequired: ["Technical Writing", "SEO", "Research"],
      difficulty: "easy",
      contractType: "hourly",
      durationLabel: "Ongoing",
      hoursPerDay: "2-3",
      budget: 25,
      paymentNotes: "Weekly payout based on number of articles submitted and approved",
      status: "open",
    });
  }

  // ─── 6. APPLICATIONS ──────────────────────────────────────────────────
  // Zain -> AI Chatbot (pending — awaiting business decision)
  if (!(await Application.exists({ projectId: aiChatbot._id, studentId: zain._id }))) {
    await Application.create({
      projectId: aiChatbot._id,
      studentId: zain._id,
      whyMeEssay: "I have extensive experience building chatbots with Python and OpenAI APIs. I previously built a customer support chatbot for a local retail chain that reduced response time by 60%. I'm confident I can deliver exceptional results for this project.",
      status: "pending",
    });
  }

  // Hira -> AI Chatbot (rejected — business chose not to proceed)
  if (!(await Application.exists({ projectId: aiChatbot._id, studentId: hira._id }))) {
    await Application.create({
      projectId: aiChatbot._id,
      studentId: hira._id,
      whyMeEssay: "I am a data scientist with strong Python and analytical skills. While my primary experience is in data analysis, I am a quick learner and eager to expand into chatbot development.",
      status: "rejected",
    });
  }

  // Sara -> Mobile App UI Design (accepted — project completed)
  if (!(await Application.exists({ projectId: mobileApp._id, studentId: sara._id }))) {
    await Application.create({
      projectId: mobileApp._id,
      studentId: sara._id,
      whyMeEssay: "I specialize in mobile UI/UX design and have completed several fitness app projects. My design portfolio includes award-winning health and wellness app interfaces that prioritize user experience.",
      status: "accepted",
    });
  }

  // ─── 7. DELIVERABLES ──────────────────────────────────────────────────
  // Asra's pending deliverable for existing E-commerce project (awaiting review)
  if (!(await Deliverable.exists({ projectId: existingProject._id, studentId: asra._id }))) {
    await Deliverable.create({
      projectId: existingProject._id,
      studentId: asra._id,
      fileUrl: "https://example.com/uploads/dashboard-ui-v1.pdf",
      status: "pending",
    });
  }

  // Sara's approved deliverable for completed Mobile App project
  if (!(await Deliverable.exists({ projectId: mobileApp._id, studentId: sara._id }))) {
    await Deliverable.create({
      projectId: mobileApp._id,
      studentId: sara._id,
      fileUrl: "https://example.com/uploads/fitrack-mockup-complete.fig",
      status: "approved",
    });
  }

  // ─── 8. PAYMENTS ──────────────────────────────────────────────────────
  // Pending payment for existing in-progress project
  if (!(await Payment.exists({ projectId: existingProject._id }))) {
    await Payment.create({
      projectId: existingProject._id,
      businessId: ali._id,
      studentId: asra._id,
      amount: 2000,
      status: "pending",
    });
  }

  // Completed (paid) payment for completed Mobile App project
  if (!(await Payment.exists({ projectId: mobileApp._id }))) {
    await Payment.create({
      projectId: mobileApp._id,
      businessId: fatima._id,
      studentId: sara._id,
      amount: 800,
      status: "paid",
    });
  }

  // ─── 9. REVIEWS ───────────────────────────────────────────────────────
  // Business reviews student for completed project
  if (!(await Review.exists({ projectId: mobileApp._id, reviewerId: fatima._id }))) {
    await Review.create({
      projectId: mobileApp._id,
      reviewerId: fatima._id,
      revieweeId: sara._id,
      rating: 5,
      comment: "Sara did an outstanding job on the FitTrack UI design. She delivered all mockups ahead of schedule, the designs were pixel-perfect, and she was very receptive to feedback. Highly recommended!",
    });
  }

  // Student reviews business for completed project
  if (!(await Review.exists({ projectId: mobileApp._id, reviewerId: sara._id }))) {
    await Review.create({
      projectId: mobileApp._id,
      reviewerId: sara._id,
      revieweeId: fatima._id,
      rating: 5,
      comment: "Fatima was an excellent client. The requirements were clear from day one, she provided timely feedback on each milestone, and the payment was processed promptly upon completion. A pleasure to work with!",
    });
  }

  // ─── 10. SKILL TESTS ───────────────────────────────────────────────────
  // Zain: skill_badge for Python (evaluated, passed with perfect score)
  if (!(await SkillTest.exists({ studentId: zain._id, testType: "skill_badge", skillTopic: "Python" }))) {
    await SkillTest.create({
      studentId: zain._id,
      testType: "skill_badge",
      skillTopic: "Python",
      questions: [
        { questionText: "What is the output of print(2 ** 3)?", type: "mcq", options: ["6", "8", "9", "4"], correctAnswer: "8" },
        { questionText: "Which data structure is immutable in Python?", type: "mcq", options: ["List", "Dict", "Tuple", "Set"], correctAnswer: "Tuple" },
        { questionText: "What does the 'self' keyword represent in Python classes?", type: "mcq", options: ["The class itself", "The current instance", "A static method", "A class variable"], correctAnswer: "The current instance" },
        { questionText: "Write a Python function to check if a string is a palindrome.", type: "coding", correctAnswer: "def is_palindrome(s): return s == s[::-1]" },
      ],
      submittedAnswers: {
        "0": "8",
        "1": "Tuple",
        "2": "The current instance",
        "3": "def is_palindrome(s): return s == s[::-1]",
      },
      score: 100,
      passed: true,
      feedback: "Excellent Python knowledge! You demonstrated strong understanding of core concepts.",
      status: "evaluated",
    });
  }

  // Hira: project_application test for Data Analysis project (submitted, awaiting evaluation)
  if (!(await SkillTest.exists({ studentId: hira._id, testType: "project_application" }))) {
    await SkillTest.create({
      studentId: hira._id,
      testType: "project_application",
      skillTopic: "Data Analysis",
      projectId: dataAnalysis._id,
      questions: [
        { questionText: "What pandas function is used to read a CSV file?", type: "mcq", options: ["read_csv()", "load_csv()", "open_csv()", "import_csv()"], correctAnswer: "read_csv()" },
        { questionText: "Explain the difference between WHERE and HAVING clauses in SQL.", type: "short_answer", correctAnswer: "WHERE filters rows before aggregation, HAVING filters after aggregation" },
        { questionText: "Which Python library is best for statistical visualization?", type: "mcq", options: ["Matplotlib", "Seaborn", "Plotly", "All of the above"], correctAnswer: "All of the above" },
      ],
      submittedAnswers: {
        "0": "read_csv()",
        "1": "WHERE filters rows before aggregation, HAVING filters after aggregation",
        "2": "All of the above",
      },
      status: "submitted",
    });
  }

  // Sara: skill_badge for UI/UX (evaluated, passed)
  if (!(await SkillTest.exists({ studentId: sara._id, testType: "skill_badge", skillTopic: "UI/UX" }))) {
    await SkillTest.create({
      studentId: sara._id,
      testType: "skill_badge",
      skillTopic: "UI/UX",
      questions: [
        { questionText: "What does UX stand for?", type: "mcq", options: ["User Experience", "Universal XML", "Unix Extension", "User Export"], correctAnswer: "User Experience" },
        { questionText: "Which tool is most commonly used for UI prototyping?", type: "mcq", options: ["Adobe Photoshop", "Figma", "VS Code", "Microsoft Excel"], correctAnswer: "Figma" },
      ],
      submittedAnswers: { "0": "User Experience", "1": "Figma" },
      score: 100,
      passed: true,
      feedback: "Great understanding of UI/UX fundamentals!",
      status: "evaluated",
    });
  }

  // Usman: generated skill test (not yet taken — edge case)
  if (!(await SkillTest.exists({ studentId: usman._id, status: "generated" }))) {
    await SkillTest.create({
      studentId: usman._id,
      testType: "skill_badge",
      skillTopic: "JavaScript",
      questions: [
        { questionText: "What is the typeof operator used for in JavaScript?", type: "mcq", options: ["Checking variable type", "Looping", "Function declaration", "Error handling"], correctAnswer: "Checking variable type" },
        { questionText: "Which keyword is used to declare a constant in JavaScript?", type: "mcq", options: ["var", "let", "const", "static"], correctAnswer: "const" },
      ],
      status: "generated",
    });
  }

  // ─── 11. MESSAGES ──────────────────────────────────────────────────────
  // Omar reaches out to Zain about AI Chatbot application
  if (!(await Message.exists({ senderId: omar._id, receiverId: zain._id }))) {
    await Message.create({
      senderId: omar._id,
      receiverId: zain._id,
      projectId: aiChatbot._id,
      message: "Hi Zain! Thanks for your detailed application to the AI Chatbot project. Your experience with OpenAI APIs is impressive. We'll review your application and get back to you within the next few days.",
    });
  }

  // Fatima congratulates Sara on completed project
  if (!(await Message.exists({ senderId: fatima._id, receiverId: sara._id }))) {
    await Message.create({
      senderId: fatima._id,
      receiverId: sara._id,
      projectId: mobileApp._id,
      message: "Hey Sara, I just wanted to say thank you again for the incredible work on the FitTrack UI! The client loved the design system you created. Looking forward to working with you on future projects!",
    });
  }

  // ─── 12. NOTIFICATIONS ─────────────────────────────────────────────────
  // Zain: application submitted
  if (!(await Notification.exists({ userId: zain._id, title: "Application Submitted" }))) {
    await Notification.create({
      userId: zain._id,
      title: "Application Submitted",
      message: "Your application for 'AI Chatbot Integration' has been submitted successfully. You will be notified when the business reviews your application.",
      type: "application",
      relatedProjectId: aiChatbot._id,
    });
  }

  // Hira: application rejected
  if (!(await Notification.exists({ userId: hira._id, title: "Application Rejected" }))) {
    await Notification.create({
      userId: hira._id,
      title: "Application Rejected",
      message: "Your application for 'AI Chatbot Integration' has been reviewed. Unfortunately, the business has decided to move forward with other candidates.",
      type: "application",
      relatedProjectId: aiChatbot._id,
    });
  }

  // Sara: project completed
  if (!(await Notification.exists({ userId: sara._id, title: "Project Completed" }))) {
    await Notification.create({
      userId: sara._id,
      title: "Project Completed",
      message: "Congratulations! The 'Mobile App UI Design' project has been marked as completed. You have received a 5-star review from Fatima Sheikh!",
      type: "project",
      relatedProjectId: mobileApp._id,
    });
  }

  // Zain: new message from Omar
  if (!(await Notification.exists({ userId: zain._id, title: "New Message from Business" }))) {
    await Notification.create({
      userId: zain._id,
      title: "New Message from Business",
      message: "You have a new message from Omar Farooq regarding 'AI Chatbot Integration'.",
      type: "message",
      relatedProjectId: aiChatbot._id,
    });
  }

  console.log("============================================");
  console.log("  ✅ Additional seed data inserted!");
  console.log("============================================");
  console.log("");
  console.log("📋 New Users:");
  console.log("   - Zain Ahmed (student, verified, complete profile)");
  console.log("   - Hira Khan (student, verified, complete profile)");
  console.log("   - Sara Ali (student, verified, complete profile)");
  console.log("   - Usman Tariq (student, unverified, NO profile)");
  console.log("   - Omar Farooq (business, verified)");
  console.log("   - Fatima Sheikh (business, verified)");
  console.log("");
  console.log("📋 Projects:");
  console.log("   - AI Chatbot Integration (open, has pending applicant)");
  console.log("   - Mobile App UI Design (completed, accepted student)");
  console.log("   - Data Analysis with Python (open, hourly, no applicants)");
  console.log("   - Content Writing for Tech Blog (open, hourly, no applicants)");
  console.log("");
  console.log("📋 Applications: pending | accepted | rejected");
  console.log("📋 Deliverables: pending | approved");
  console.log("📋 Payments: pending | paid");
  console.log("📋 Reviews: business→student | student→business");
  console.log("📋 Skill Tests: evaluated(passed) | submitted | generated");
  console.log("📋 Messages & Notifications for all scenarios");

  process.exit();
}

seedAdditional();

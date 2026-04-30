import type { Project } from "@/types/project";
import type { Application } from "@/types/application";

export const STUDENT = {
  name: "Aarav Sharma",
  initials: "AS",
  level: "InternX Associate",
  levelIndex: 1,
  university: "IIT Delhi",
  degree: "B.Tech, Computer Science",
  semester: "6th Semester",
  graduation: "2027",
  email: "aarav.sharma@iitd.ac.in",
  earnings: 18450,
  completed: 4,
  pending: 3,
  rating: 4.8,
};

export const SKILLS = [
  "React", "TypeScript", "Next.js", "Node.js", "Python", "Django",
  "UI/UX Design", "Figma", "Tailwind CSS", "PostgreSQL", "MongoDB",
  "AWS", "Docker", "Machine Learning", "Data Analysis", "Content Writing",
  "SEO", "Marketing Strategy", "Brand Design", "Motion Graphics",
];

export const STUDENT_SKILLS = ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "Figma"];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Marketing Analytics Dashboard",
    business: "Northwind Logistics",
    businessLogo: "NL",
    description: "Build an internal analytics dashboard with real-time KPIs, charts, and exportable reports.",
    skills: ["React", "TypeScript", "Recharts", "Tailwind CSS"],
    difficulty: "Medium",
    contract: "Fixed",
    budget: "₹45,000",
    budgetValue: 45000,
    timeline: "4 weeks",
    posted: "2 days ago",
    applicants: 12,
    longDescription:
      "We need a polished analytics dashboard that surfaces real-time shipping KPIs across our fleet. The dashboard should support filtering, exporting, and integrate with our existing REST API. Strong attention to data viz and dark-mode UI required.",
    scope: [
      "Design 4 dashboard screens (Overview, Fleet, Routes, Reports)",
      "Implement chart library integration with mock + real APIs",
      "Build CSV / PDF export pipeline",
      "Responsive layouts for tablet & desktop",
    ],
  },
  {
    id: "p2",
    title: "Mobile Onboarding Redesign",
    business: "Quill & Stone",
    businessLogo: "QS",
    description: "Redesign 6-screen onboarding for our reading app. Figma deliverables + clickable prototype.",
    skills: ["UI/UX Design", "Figma", "Mobile"],
    difficulty: "Basic",
    contract: "Fixed",
    budget: "₹18,000",
    budgetValue: 18000,
    timeline: "2 weeks",
    posted: "5 days ago",
    applicants: 28,
  },
  {
    id: "p3",
    title: "ML Recommendation Engine",
    business: "Prismic Labs",
    businessLogo: "PL",
    description: "Train and deploy a recommendation model for our e-commerce platform.",
    skills: ["Python", "Machine Learning", "AWS"],
    difficulty: "Hard",
    contract: "Hourly",
    budget: "₹1,500/hr",
    budgetValue: 1500,
    timeline: "6 weeks",
    posted: "1 week ago",
    applicants: 7,
  },
  {
    id: "p4",
    title: "SaaS Landing Page",
    business: "Vector Studio",
    businessLogo: "VS",
    description: "Design and build a high-conversion landing page for our new B2B product launch.",
    skills: ["React", "Next.js", "Tailwind CSS", "Motion"],
    difficulty: "Medium",
    contract: "Fixed",
    budget: "₹32,000",
    budgetValue: 32000,
    timeline: "3 weeks",
    posted: "3 days ago",
    applicants: 19,
  },
  {
    id: "p5",
    title: "Distributed Trading Engine",
    business: "Helios Capital",
    businessLogo: "HC",
    description: "Build a low-latency order matching engine with WebSocket streaming and audit logs.",
    skills: ["Go", "Distributed Systems", "PostgreSQL"],
    difficulty: "Hardcore",
    contract: "Hourly",
    budget: "₹3,200/hr",
    budgetValue: 3200,
    timeline: "10 weeks",
    posted: "12 hours ago",
    applicants: 3,
  },
  {
    id: "p6",
    title: "Brand Identity & Style Guide",
    business: "Linden & Co.",
    businessLogo: "LC",
    description: "Create logo system, brand guidelines, and marketing collateral templates.",
    skills: ["Brand Design", "Figma", "Illustrator"],
    difficulty: "Basic",
    contract: "Fixed",
    budget: "₹22,000",
    budgetValue: 22000,
    timeline: "3 weeks",
    posted: "6 days ago",
    applicants: 16,
  },
];

export const APPLICATIONS: Application[] = [
  {
    id: "a1",
    projectId: "p1",
    projectTitle: "Marketing Analytics Dashboard",
    business: "Northwind Logistics",
    businessLogo: "NL",
    appliedAt: "Apr 22, 2026",
    status: "shortlisted",
    budget: "₹45,000",
  },
  {
    id: "a2",
    projectId: "old1",
    projectTitle: "Customer Portal Refresh",
    business: "Bramble Health",
    businessLogo: "BH",
    appliedAt: "Apr 15, 2026",
    status: "selected",
    budget: "₹38,000",
  },
  {
    id: "a3",
    projectId: "old2",
    projectTitle: "Investor Pitch Site",
    business: "Aurora Climate",
    businessLogo: "AC",
    appliedAt: "Apr 10, 2026",
    status: "rejected",
    budget: "₹15,000",
  },
  {
    id: "a4",
    projectId: "old3",
    projectTitle: "iOS Notification Module",
    business: "Foxglove Mobile",
    businessLogo: "FM",
    appliedAt: "Apr 02, 2026",
    status: "pending",
    budget: "₹26,000",
  },
];

export const ACTIVE_PROJECT = {
  id: "active1",
  title: "Customer Portal Refresh",
  business: "Bramble Health",
  businessLogo: "BH",
  budget: "₹38,000",
  progress: 62,
  startDate: "Apr 18, 2026",
  endDate: "May 30, 2026",
  daysLeft: 24,
  description:
    "Refresh the patient-facing customer portal with a modernized UI, improved accessibility, and a new appointment scheduler module.",
  milestones: [
    { name: "Design System & Wireframes", done: true, due: "Apr 24" },
    { name: "Component Library", done: true, due: "May 02" },
    { name: "Scheduler Module", done: false, due: "May 16" },
    { name: "QA & Handoff", done: false, due: "May 30" },
  ],
};

export const TASKS = [
  { id: "t1", title: "Set up component library scaffolding", status: "Done", due: "Apr 22", priority: "Medium" },
  { id: "t2", title: "Build appointment booking flow", status: "In Progress", due: "May 04", priority: "High" },
  { id: "t3", title: "Implement reschedule + cancel logic", status: "In Progress", due: "May 08", priority: "High" },
  { id: "t4", title: "Accessibility audit (WCAG AA)", status: "Todo", due: "May 18", priority: "Medium" },
  { id: "t5", title: "Final QA pass and bug bash", status: "Todo", due: "May 26", priority: "Low" },
];

export const CONVERSATIONS = [
  { id: "c1", name: "Bramble Health", initials: "BH", last: "Sounds good — let's review the scheduler tomorrow at 11.", time: "10:42", unread: 2, active: true },
  { id: "c2", name: "Northwind Logistics", initials: "NL", last: "Thanks for the detailed proposal!", time: "Yesterday", unread: 0 },
  { id: "c3", name: "Vector Studio", initials: "VS", last: "We'll get back to you by EOW.", time: "Apr 22", unread: 0 },
  { id: "c4", name: "Foxglove Mobile", initials: "FM", last: "Application received — under review.", time: "Apr 02", unread: 0 },
];

export const MESSAGES = [
  { id: "m1", from: "them", text: "Hey Aarav — the scheduler designs look great.", time: "10:18" },
  { id: "m2", from: "them", text: "One thought: can we add a recurring appointment option?", time: "10:18" },
  { id: "m3", from: "me", text: "Yes — I can add weekly + monthly recurrence. Should take ~1 day.", time: "10:34" },
  { id: "m4", from: "me", text: "I'll push a Figma update by EOD with the rules + edge cases.", time: "10:35" },
  { id: "m5", from: "them", text: "Sounds good — let's review the scheduler tomorrow at 11.", time: "10:42" },
];

export const DELIVERABLES = [
  { id: "d1", name: "Design System v2.fig", size: "12.4 MB", submitted: "Apr 24, 2026", version: "v2.1", status: "Approved", notes: "Final tokens locked, components documented." },
  { id: "d2", name: "Component Library Source.zip", size: "8.1 MB", submitted: "May 03, 2026", version: "v1.0", status: "Revision Requested", notes: "Please revisit the form input states for the dark theme." },
  { id: "d3", name: "Scheduler Wireframes.pdf", size: "3.2 MB", submitted: "May 09, 2026", version: "v1.2", status: "In Review", notes: "Includes recurrence + edge cases." },
];

export const LEVELS = [
  { name: "InternX Scholar", range: "0 – 2 projects", description: "Entry tier for new students. Build your first portfolio.", perks: ["Access to Basic projects", "Community mentorship", "Verified profile"] },
  { name: "InternX Associate", range: "3 – 6 projects", description: "Trusted contributors. Unlock medium difficulty projects.", perks: ["Medium difficulty access", "Priority support", "Early project alerts"] },
  { name: "InternX Professional", range: "7 – 14 projects", description: "Proven specialists. Higher rates and Hard projects.", perks: ["Hard difficulty access", "Featured profile", "Premium clients"] },
  { name: "InternX Expert", range: "15+ projects", description: "Top-tier marketplace talent. Hardcore briefs and direct invites.", perks: ["Hardcore access", "Top-of-search ranking", "Dedicated success manager"] },
];

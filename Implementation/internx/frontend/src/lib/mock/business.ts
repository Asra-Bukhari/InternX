export const BUSINESS = {
  name: "Tara Chen",
  initials: "TC",
  company: "TechCraft Ltd.",
  email: "tara@techcraft.co",
  industry: "SaaS",
  size: "11–50",
  founded: "2019",
  website: "techcraft.co",
  totalSpent: 12480,
  activeProjects: 3,
  completedProjects: 11,
  pendingDeliverables: 2,
};

export const BUSINESS_STATS = [
  { label: "Active Projects", value: "3", trend: "+1 this month" },
  { label: "In Hiring Stage", value: "2", trend: "5 applicants total" },
  { label: "Completed", value: "11", trend: "+2 this quarter" },
  { label: "Total Spending", value: "$12,480", trend: "+$1,200 this month" },
  { label: "Pending Deliverables", value: "2", trend: "Across 2 projects" },
];

export const BUSINESS_PROJECTS = [
  {
    id: "p1",
    title: "E-Commerce Mobile App UI",
    description: "Modern, conversion-focused UI for a B2C shopping app — onboarding, product, cart and checkout.",
    skills: ["UI/UX", "Figma", "Mobile"],
    difficulty: "Hard",
    contractType: "Fixed-Price",
    budget: "$1,200",
    deadline: "Mar 20, 2026",
    progress: 65,
    status: "In Progress",
    applicants: 8,
    selectedStudent: "Aisha Mensah",
  },
  {
    id: "p2",
    title: "Customer Analytics Dashboard",
    description: "Real-time KPI dashboard with filters, exports, and role-based access.",
    skills: ["React", "TypeScript", "Recharts"],
    difficulty: "Medium",
    contractType: "Fixed-Price",
    budget: "$1,800",
    deadline: "Apr 10, 2026",
    progress: 30,
    status: "In Progress",
    applicants: 12,
    selectedStudent: "Marco Silva",
  },
  {
    id: "p3",
    title: "Marketing Website Redesign",
    description: "Refresh the public site with new IA, typography, and conversion-focused page templates.",
    skills: ["Webflow", "Figma", "Copywriting"],
    difficulty: "Medium",
    contractType: "Fixed-Price",
    budget: "$900",
    deadline: "Mar 28, 2026",
    progress: 0,
    status: "Hiring",
    applicants: 5,
    selectedStudent: null,
  },
];

export const BUSINESS_APPLICANTS = [
  { id: "ap1", name: "Aisha Mensah", initials: "AM", university: "UCL", level: "InternX Professional", rating: 4.9, projectId: "p1", projectTitle: "E-Commerce Mobile App UI", skills: ["Figma", "UI/UX", "Mobile"], intro: "Specialised in mobile commerce UI. 6 shipped apps in last 18 months.", appliedDate: "Mar 1, 2026" },
  { id: "ap2", name: "Marco Silva", initials: "MS", university: "USP", level: "InternX Associate", rating: 4.7, projectId: "p2", projectTitle: "Customer Analytics Dashboard", skills: ["React", "TypeScript", "Recharts"], intro: "Frontend-heavy CS student with strong data-viz background.", appliedDate: "Feb 24, 2026" },
  { id: "ap3", name: "Priya Nair", initials: "PN", university: "IIT Bombay", level: "InternX Professional", rating: 4.85, projectId: "p3", projectTitle: "Marketing Website Redesign", skills: ["Webflow", "Figma"], intro: "Web design + marketing sites portfolio across 9 SaaS clients.", appliedDate: "Mar 4, 2026" },
  { id: "ap4", name: "Lukas Hartmann", initials: "LH", university: "TU Munich", level: "InternX Associate", rating: 4.6, projectId: "p3", projectTitle: "Marketing Website Redesign", skills: ["Figma", "Copywriting", "Webflow"], intro: "Strong copy + design hybrid. Recent work for 2 EU SaaS startups.", appliedDate: "Mar 5, 2026" },
];

// --- Workspace mocks (decomposed from ProjectWorkspace.tsx) ---
export const WORKSPACE_PROJECT = {
  id: "p1",
  title: "E-Commerce Mobile App UI",
  student: { name: "Aisha Mensah", initials: "AM", university: "UCL", level: "InternX Professional" },
  difficulty: "Hard" as const,
  contractType: "Fixed-Price",
  budget: "$1,200",
  deadline: "Mar 20, 2026",
  progress: 65,
  status: "In Progress",
};

export const WORKSPACE_TASKS = [
  { id: "t1", title: "Set up Figma project structure and components", status: "Completed", dueDate: "Mar 3, 2026", priority: "Medium" },
  { id: "t2", title: "Design onboarding flow (5 screens)", status: "Completed", dueDate: "Mar 6, 2026", priority: "High" },
  { id: "t3", title: "Product listing & detail page designs", status: "In Progress", dueDate: "Mar 10, 2026", priority: "High" },
  { id: "t4", title: "Cart and checkout flow designs", status: "In Progress", dueDate: "Mar 13, 2026", priority: "High" },
  { id: "t5", title: "User profile and order history screens", status: "Pending", dueDate: "Mar 16, 2026", priority: "Medium" },
  { id: "t6", title: "Design system documentation", status: "Pending", dueDate: "Mar 18, 2026", priority: "Low" },
  { id: "t7", title: "Final handoff & asset export", status: "Pending", dueDate: "Mar 20, 2026", priority: "High" },
];

export const WORKSPACE_CHAT = [
  { id: "m1", sender: "Aisha Mensah", isMe: false, text: "Hi! I've reviewed the brief. I'll start with the Figma structure today.", time: "Mar 1, 9:12 AM", initials: "AM" },
  { id: "m2", sender: "You", isMe: true, text: "Perfect! Make sure the component library follows our brand guidelines I shared.", time: "Mar 1, 9:30 AM", initials: "TC" },
  { id: "m3", sender: "Aisha Mensah", isMe: false, text: "Absolutely. I noticed you use the brand orange as primary. I'll set that as the CTA color throughout.", time: "Mar 1, 10:04 AM", initials: "AM" },
  { id: "m4", sender: "You", isMe: true, text: "Yes! And keep the dark backgrounds consistent with our web palette.", time: "Mar 1, 10:11 AM", initials: "TC" },
  { id: "m5", sender: "Aisha Mensah", isMe: false, text: "Done! Onboarding flow is complete. 5 screens uploaded to the Files section. Please review when you can.", time: "Mar 6, 2:35 PM", initials: "AM" },
  { id: "m6", sender: "You", isMe: true, text: "Reviewed! The illustrations are clean. Minor note — the progress bar on screen 3 needs more contrast.", time: "Mar 6, 4:00 PM", initials: "TC" },
  { id: "m7", sender: "Aisha Mensah", isMe: false, text: "Fixed and re-uploaded. Moving on to the product listing screens now!", time: "Mar 6, 5:15 PM", initials: "AM" },
];

export const WORKSPACE_MEETINGS = [
  { id: "mt1", date: "Mar 2, 2026", time: "10:00 AM", duration: "30 min", price: "$15", status: "Completed", topic: "Project kickoff & brief alignment" },
  { id: "mt2", date: "Mar 8, 2026", time: "2:00 PM", duration: "45 min", price: "$22.50", status: "Scheduled", topic: "Mid-project design review" },
];

export const WORKSPACE_FILES = [
  { id: "f1", name: "Onboarding Flow v2.fig", type: "figma", size: "4.2 MB", uploadedBy: "Aisha Mensah", date: "Mar 6, 2026" },
  { id: "f2", name: "Brand Guidelines.pdf", type: "pdf", size: "2.1 MB", uploadedBy: "TechCraft Ltd.", date: "Mar 1, 2026" },
  { id: "f3", name: "Product Listing Screens.fig", type: "figma", size: "6.8 MB", uploadedBy: "Aisha Mensah", date: "Mar 8, 2026" },
  { id: "f4", name: "Reference Screenshots.zip", type: "zip", size: "12.4 MB", uploadedBy: "TechCraft Ltd.", date: "Mar 1, 2026" },
  { id: "f5", name: "Component Library.fig", type: "figma", size: "3.5 MB", uploadedBy: "Aisha Mensah", date: "Mar 4, 2026" },
];

export const WORKSPACE_DELIVERABLES = [
  { id: "dv1", version: "v1.0", date: "Mar 5, 2026", status: "Revision Requested", note: "Contrast issues on progress bar, typography inconsistency on screen 3." },
  { id: "dv2", version: "v1.1", date: "Mar 6, 2026", status: "Revision Requested", note: "Cart screen missing empty state design." },
  { id: "dv3", version: "v2.0", date: "Mar 9, 2026", status: "Pending Review", note: "All screens submitted including empty states and error states." },
];

export const BUSINESS_PAYMENTS = [
  { id: "pay1", projectTitle: "E-Commerce Mobile App UI", student: "Aisha Mensah", amount: "$1,200", status: "in-escrow" as const, date: "Mar 20, 2026" },
  { id: "pay2", projectTitle: "Customer Analytics Dashboard", student: "Marco Silva", amount: "$1,800", status: "in-escrow" as const, date: "Apr 10, 2026" },
  { id: "pay3", projectTitle: "Brand System Refresh", student: "Priya Nair", amount: "$650", status: "released" as const, date: "Feb 12, 2026" },
  { id: "pay4", projectTitle: "Investor Deck Redesign", student: "Lukas Hartmann", amount: "$420", status: "released" as const, date: "Jan 28, 2026" },
];

export const BUSINESS_CONVERSATIONS = [
  { id: "bc1", name: "Aisha Mensah", initials: "AM", project: "E-Commerce Mobile App UI", last: "Fixed and re-uploaded. Moving on to product listing screens.", time: "Mar 6", unread: 0, active: true },
  { id: "bc2", name: "Marco Silva", initials: "MS", project: "Customer Analytics Dashboard", last: "Pushed v0.3 of the dashboard for review.", time: "Mar 5", unread: 1 },
  { id: "bc3", name: "Priya Nair", initials: "PN", project: "Marketing Website Redesign", last: "Thanks — I'll send a portfolio update by EOD.", time: "Mar 4", unread: 0 },
];

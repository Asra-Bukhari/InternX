import { createBrowserRouter } from "react-router";

import PublicLayout from "@/layouts/PublicLayout";
import AuthLayout from "@/layouts/AuthLayout";
import StudentDashboardLayout from "@/layouts/StudentDashboardLayout";
import BusinessDashboardLayout from "@/layouts/BusinessDashboardLayout";

import Home from "@/pages/public/Home";
import HowItWorks from "@/pages/public/HowItWorks";
import WhyResume from "@/pages/public/WhyResume";
import Universities from "@/pages/public/Universities";
import PricingRules from "@/pages/public/PricingRules";
import NotFound from "@/pages/public/NotFound";

import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import StudentSignUp from "@/pages/auth/StudentSignUp";
import BusinessSignUp from "@/pages/auth/BusinessSignUp";

import StudentDashboard from "@/pages/student/Dashboard";
import StudentProjects from "@/pages/student/Projects";
import StudentProjectDetails from "@/pages/student/ProjectDetails";
import StudentApplications from "@/pages/student/Applications";
import StudentActiveProject from "@/pages/student/ActiveProject";
import StudentMessages from "@/pages/student/Messages";
import StudentProfile from "@/pages/student/Profile";
import StudentLevels from "@/pages/student/Levels";

import BusinessDashboard from "@/pages/business/Dashboard";
import BusinessProjects from "@/pages/business/Projects";
import BusinessCreateProject from "@/pages/business/CreateProject";
import BusinessProjectApplicants from "@/pages/business/ProjectApplicants";
import BusinessProjectWorkspace from "@/pages/business/ProjectWorkspace";
import BusinessAllApplicants from "@/pages/business/Applicants";
import BusinessMessages from "@/pages/business/Messages";
import BusinessPayments from "@/pages/business/Payments";
import BusinessProfile from "@/pages/business/Profile";

export const router = createBrowserRouter([
  // Public marketing site
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "how-it-works", Component: HowItWorks },
      { path: "why-resume", Component: WhyResume },
      { path: "universities", Component: Universities },
      { path: "pricing", Component: PricingRules },
      { path: "*", Component: NotFound },
    ],
  },

  // Auth flow
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "signup", Component: SignUp },
      { path: "signup/student", Component: StudentSignUp },
      { path: "signup/business", Component: BusinessSignUp },
    ],
  },

  // Student dashboard
  {
    path: "/dashboard/student",
    Component: StudentDashboardLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "projects", Component: StudentProjects },
      { path: "projects/:id", Component: StudentProjectDetails },
      { path: "applications", Component: StudentApplications },
      { path: "active", Component: StudentActiveProject },
      { path: "messages", Component: StudentMessages },
      { path: "messages/:threadId", Component: StudentMessages },
      { path: "profile", Component: StudentProfile },
      { path: "levels", Component: StudentLevels },
    ],
  },

  // Business dashboard
  {
    path: "/dashboard/business",
    Component: BusinessDashboardLayout,
    children: [
      { index: true, Component: BusinessDashboard },
      { path: "projects", Component: BusinessProjects },
      { path: "projects/new", Component: BusinessCreateProject },
      { path: "projects/:id/applicants", Component: BusinessProjectApplicants },
      { path: "projects/:id/workspace", Component: BusinessProjectWorkspace },
      { path: "applicants", Component: BusinessAllApplicants },
      { path: "messages", Component: BusinessMessages },
      { path: "payments", Component: BusinessPayments },
      { path: "profile", Component: BusinessProfile },
    ],
  },
]);

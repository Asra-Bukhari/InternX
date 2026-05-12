export const SKILL_CATEGORIES = [
  {
    name: "Frontend / Web",
    skills: [
      "React", "Next.js", "Vue.js", "Angular", "TypeScript", "JavaScript",
      "HTML/CSS", "Tailwind CSS", "Bootstrap", "SASS", "Redux",
      "React Native", "Flutter", "Electron", "Three.js",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js", "Express", "NestJS", "Django", "Flask", "FastAPI",
      "Laravel", "Spring Boot", "ASP.NET", "Ruby on Rails", "Go",
      "Rust", "PHP", "GraphQL", "REST API",
    ],
  },
  {
    name: "Languages",
    skills: [
      "Python", "Java", "C++", "C#", "Kotlin", "Swift",
      "Dart", "R", "MATLAB", "Bash/Shell",
    ],
  },
  {
    name: "Databases",
    skills: [
      "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis",
      "Firebase", "Supabase", "Oracle SQL", "Cassandra", "Elasticsearch",
    ],
  },
  {
    name: "AI / Machine Learning",
    skills: [
      "Machine Learning", "Deep Learning", "Generative AI", "NLP",
      "Computer Vision", "TensorFlow", "PyTorch", "Scikit-learn",
      "OpenCV", "LLM Engineering", "Prompt Engineering", "AI Agents",
      "LangChain", "Hugging Face", "Recommendation Systems",
    ],
  },
  {
    name: "Data Science / Analytics",
    skills: [
      "Data Science", "Data Analysis", "Data Visualization", "Power BI",
      "Tableau", "Pandas", "NumPy", "Apache Spark", "Big Data", "ETL Pipelines",
    ],
  },
  {
    name: "Cyber Security",
    skills: [
      "Cyber Security", "Ethical Hacking", "Penetration Testing",
      "Network Security", "Digital Forensics", "SOC Analysis",
      "Malware Analysis", "Cryptography", "OSINT", "SIEM",
    ],
  },
  {
    name: "Cloud / DevOps",
    skills: [
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
      "CI/CD", "Terraform", "Jenkins", "Linux", "DevOps", "MLOps",
    ],
  },
  {
    name: "Automation / Tools",
    skills: [
      "Selenium", "Web Scraping", "Automation", "Git/GitHub",
    ],
  },
] as const;

// Flat list — keeps all backend / eligibility logic working unchanged
export const SKILLS_OPTIONS = SKILL_CATEGORIES.flatMap((c) => c.skills);

export const MAX_SKILLS = 6;

// Max distinct categories a user may select from
export const MAX_SKILL_CATEGORIES = 2;

export interface Availability {
  startDate?: string;
  endDate?: string;
}

export type AvailabilityHours = "2-4" | "4-6" | "6+";

export interface AvailabilityExtended {
  hoursPerDay?: AvailabilityHours;
  startTime?: string; // "HH:MM" 24h
  endTime?: string;
  unavailableDays?: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  examPeriodStart?: string;
  examPeriodEnd?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

/**
 * Extended profile data not yet supported by backend Profile schema.
 * Persisted as a JSON string inside `Profile.degree` (the only free-form
 * text field available) until backend schema is extended.
 *
 * The real degree value is stored under `_degree` here.
 */
export interface ProfileExtension {
  _degree?: string;          // the actual academic degree string
  _degreeLevel?: string;     // "Bachelor's" / "Master's" / etc
  _graduationYear?: string;
  _cgpa?: string;
  bio?: string;
  headline?: string;
  location?: string;
  avatarUrl?: string;
  availabilityExt?: AvailabilityExtended;
  portfolio?: PortfolioProject[];
  lastSkillUpdate?: string;  // ISO timestamp
  profileCompleted?: boolean;
}

/** Backend Profile shape (mirrors Mongoose Profile model). */
export interface Profile {
  _id: string;
  userId: string;
  university?: string;
  degree?: string;             // raw — may contain JSON-encoded extension
  semester?: string;
  skills?: string[];
  availability?: Availability;
  completedProjects: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Profile + parsed extension fields, used everywhere on the frontend. */
export interface FullProfile extends Profile {
  ext: ProfileExtension;
  cleanDegree: string;         // displayable degree (extension._degree fallback to raw)
}

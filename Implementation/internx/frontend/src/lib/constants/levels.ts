export interface LevelDef {
  name: string;
  range: string;
  min: number;
  max: number | null;
  description: string;
  perks: string[];
}

export const LEVELS: LevelDef[] = [
  {
    name: "InternX Scholar",
    range: "0–2 projects",
    min: 0,
    max: 2,
    description: "Just starting out. Build your portfolio with Basic-tier projects.",
    perks: ["Apply to Basic projects", "Standard review priority", "Verified badge"],
  },
  {
    name: "InternX Associate",
    range: "3–6 projects",
    min: 3,
    max: 6,
    description: "Proven track record. Unlock Medium-tier briefs and higher rates.",
    perks: ["Apply to Basic + Medium", "Higher application priority", "Featured profile"],
  },
  {
    name: "InternX Professional",
    range: "7–14 projects",
    min: 7,
    max: 14,
    description: "Trusted talent. Higher pay, complex briefs, faster review.",
    perks: ["Apply to Hard projects", "Top-of-stack review", "Priority support"],
  },
  {
    name: "InternX Expert",
    range: "15+ projects",
    min: 15,
    max: null,
    description: "Top tier. Hardcore briefs, premium rates, employer-facing showcase.",
    perks: ["Apply to Hardcore projects", "Custom rates", "Employer attestation"],
  },
];

export function levelForCount(completed: number): { level: LevelDef; index: number } {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const l = LEVELS[i];
    if (completed >= l.min) return { level: l, index: i };
  }
  return { level: LEVELS[0], index: 0 };
}

export function nextLevelDelta(completed: number): { next: LevelDef | null; remaining: number; pct: number } {
  const { level, index } = levelForCount(completed);
  const next = index < LEVELS.length - 1 ? LEVELS[index + 1] : null;
  if (!next || level.max === null) return { next: null, remaining: 0, pct: 100 };
  const remaining = Math.max(0, next.min - completed);
  const span = next.min - level.min || 1;
  const pct = Math.min(100, Math.round(((completed - level.min) / span) * 100));
  return { next, remaining, pct };
}

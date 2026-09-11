export type SectorType =
  | "Alpha (Permafrost)"
  | "Beta (Scorch Basin)"
  | "Gamma (Blackwood Mire)"
  | "Delta (Iron Compound)";

export type ContestantStatus = "active" | "eliminated" | "immunity_holder" | "tribunal_risk";

export type ArchetypeType =
  | "The Tactician"
  | "The Survivalist"
  | "The Diplomat"
  | "The Enforcer"
  | "The Underdog"
  | "The Wildcard";

export interface ContestantStats {
  endurance: number; // 0 - 100
  strategy: number;  // 0 - 100
  social: number;    // 0 - 100
  survival: number;  // 0 - 100
}

export interface Contestant {
  id: string;
  name: string;
  age: number;
  occupation: string;
  hometown: string;
  sector: SectorType;
  status: ContestantStatus;
  tagline: string;
  bio: string;
  archetype: ArchetypeType;
  stats: ContestantStats;
  alliance: string;
  avatarUrl: string;
  eliminationEpisode?: number;
  keyStrength: string;
  threatLevel: "High" | "Medium" | "Critical";
}

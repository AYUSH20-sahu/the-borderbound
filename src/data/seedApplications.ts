export interface AdminApplicationItem {
  applicationId: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    age: number;
    occupation: string;
    hometown: string;
    hasValidPassport: boolean;
  };
  media: {
    photoUrl: string;
    videoAuditionUrl: string;
    videoDurationSeconds?: number;
  };
  pitch: {
    sectorPreference: string;
    archetypePreference: string;
    strategyPitch: string;
    survivalExperience: string;
    whyBorderbound: string;
  };
  status: "pending" | "under_review" | "shortlisted" | "rejected" | "selected";
  internalNotes?: string;
  createdAt: string;
}

export const INITIAL_APPLICATIONS: AdminApplicationItem[] = [
  {
    applicationId: "BB-2026-78102",
    applicant: {
      fullName: "Rowan Sterling",
      email: "rowan.sterling@gmail.com",
      phone: "+1 (555) 342-9182",
      age: 28,
      occupation: "High-Altitude Flight Paramedic",
      hometown: "Denver, CO",
      hasValidPassport: true,
    },
    media: {
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      videoAuditionUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDurationSeconds: 54,
    },
    pitch: {
      sectorPreference: "Sector Alpha (Permafrost)",
      archetypePreference: "The Survivalist",
      strategyPitch: "Make myself indispensable to camp warmth on day one. Establish an inner circle with one brute and one socialite, then blindside the physical threats at merge.",
      survivalExperience: "5 years backcountry search and rescue in the Colorado Rockies. Certified wilderness first responder. Have survived 7 days solo in blizzard conditions.",
      whyBorderbound: "I work daily on the razor's edge between life and death. The Borderbound is the ultimate crucible to test what I'm truly made of without hospital backup.",
    },
    status: "shortlisted",
    internalNotes: "Strong audition tape. Great on camera, very articulate. Recommend casting callback for Alpha Sector.",
    createdAt: "2026-09-08T14:32:00.000Z",
  },
  {
    applicationId: "BB-2026-92144",
    applicant: {
      fullName: "Jaxon 'Forge' Vance",
      email: "jaxon.vance@yahoo.com",
      phone: "+1 (555) 981-2241",
      age: 34,
      occupation: "Deep-Sea Commercial Welder",
      hometown: "Galveston, TX",
      hasValidPassport: true,
    },
    media: {
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      videoAuditionUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDurationSeconds: 58,
    },
    pitch: {
      sectorPreference: "Sector Delta (Iron Compound)",
      archetypePreference: "The Enforcer",
      strategyPitch: "Dominate the early team physical challenges to earn trust. Never talk strategy in public, only in 1-on-1 night walks.",
      survivalExperience: "12 years working underwater offshore rigs. Unflinching pain threshold and high heat tolerance.",
      whyBorderbound: "My entire career is built in environments that want to kill me. 40 days on dry land against 31 contestants sounds like a vacation.",
    },
    status: "under_review",
    internalNotes: "Incredible physical presence. Potential frontrunner for team captain.",
    createdAt: "2026-09-09T09:15:00.000Z",
  },
  {
    applicationId: "BB-2026-61029",
    applicant: {
      fullName: "Khadija Al-Mansoor",
      email: "k.almansoor@techcorp.io",
      phone: "+1 (555) 203-8871",
      age: 26,
      occupation: "Machine Learning Risk Architect",
      hometown: "Seattle, WA",
      hasValidPassport: true,
    },
    media: {
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      videoAuditionUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDurationSeconds: 49,
    },
    pitch: {
      sectorPreference: "Sector Beta (Scorch Basin)",
      archetypePreference: "The Tactician",
      strategyPitch: "Quantify social alliances. Track who talks to whom every morning. Predict vote splits with Bayesian game theory.",
      survivalExperience: "Novice camper, but extreme mental endurance. Competitive marathoner and ultra-distance cyclist.",
      whyBorderbound: "Reality television is just a social graph waiting to be optimized. I want to prove intellectual strategy beats muscle every single time.",
    },
    status: "pending",
    internalNotes: "",
    createdAt: "2026-09-10T18:45:00.000Z",
  },
  {
    applicationId: "BB-2026-33918",
    applicant: {
      fullName: "Mateo Silva",
      email: "mateo.silva@miamievents.com",
      phone: "+1 (555) 772-4019",
      age: 29,
      occupation: "Luxury Hospitality Director",
      hometown: "Miami, FL",
      hasValidPassport: true,
    },
    media: {
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      videoAuditionUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDurationSeconds: 42,
    },
    pitch: {
      sectorPreference: "Sector Gamma (Blackwood Mire)",
      archetypePreference: "The Diplomat",
      strategyPitch: "Be the camp confessor. When everyone is starving and cold, the person who listens with genuine empathy holds all the voting leverage.",
      survivalExperience: "Minimal wilderness experience, but exceptional social resilience and emotional intelligence.",
      whyBorderbound: "People underestimate social chameleons. In the end, the jury votes for who they like or respect, not who made fire fastest.",
    },
    status: "selected",
    internalNotes: "Confirmed for Sector Gamma casting roster. Contract and medical clearances cleared.",
    createdAt: "2026-09-05T11:20:00.000Z",
  },
  {
    applicationId: "BB-2026-19482",
    applicant: {
      fullName: "Devon Cross",
      email: "devon.cross@outdoors.org",
      phone: "+1 (555) 438-9902",
      age: 23,
      occupation: "Backpacking Trail Guide",
      hometown: "Bozeman, MT",
      hasValidPassport: false,
    },
    media: {
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
      videoAuditionUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDurationSeconds: 51,
    },
    pitch: {
      sectorPreference: "Sector Alpha (Permafrost)",
      archetypePreference: "The Underdog",
      strategyPitch: "Work from the shadows and survive day by day.",
      survivalExperience: "Appalachian Trail thru-hike completed in 2024.",
      whyBorderbound: "Want to challenge myself in extreme frontiers.",
    },
    status: "rejected",
    internalNotes: "Passport expired within 6 months. Ineligible under current production travel bylaws.",
    createdAt: "2026-09-04T08:12:00.000Z",
  },
];

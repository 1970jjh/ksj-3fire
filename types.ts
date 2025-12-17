
export enum Step {
  INTRO = 'INTRO',
  SITUATION = 'SITUATION',
  PROBLEM_DEFINITION = 'PROBLEM_DEFINITION',
  ANALYSIS_WHY = 'ANALYSIS_WHY',
  SOLUTION = 'SOLUTION',
  REPORT = 'REPORT'
}

export type ViewMode = 'LANDING' | 'LEARNER' | 'ADMIN' | 'ADMIN_SETUP';

export interface CauseAnalysis {
  directCause: string;       // 근본 원인 (직접 원인)
  contributingFactors: string; // 영향 요인 (확대 요인)
}

export interface SessionConfig {
  groupName: string;
  totalTeams: number; // 1 to 12
  isSessionActive: boolean;
}

export interface UserProfile {
  name: string;
  teamId: number;
  teamName: string;
  groupName: string;
}

export interface SimulationState {
  currentStep: Step;
  user: UserProfile | null;
  problemDefinition: {
    humanDamage: string;
    materialDamage: string;
    others: string;
  };
  analysisFire: CauseAnalysis;   // Replaced whysFire
  analysisInjury: CauseAnalysis; // Replaced whysInjury
  solutions: {
    immediate: string;
    prevention: string;
    contingency: string;
  };
}

export const INITIAL_ANALYSIS: CauseAnalysis = {
  directCause: '',
  contributingFactors: ''
};

// Mock data type for Admin Dashboard
export interface TeamProgress {
  id: string;
  name: string;
  step: Step;
  lastActive: string;
  score?: number;
}
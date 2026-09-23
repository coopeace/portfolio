import achievementsData from "./achievements.json";

export interface Achievement {
  platform: "LeetCode" | "NeetCode" | "HackerRank";
  label: string;
  solved?: number;
  total?: number;
  badges?: number;
  progress?: number;
  url: string;
  lastUpdated?: string;
  description: string;
  status: "Active Exploration" | "Curated Progression" | "Fundamental Challenges";
  category: "DSA & Problem Solving";
}

export const achievements: Achievement[] = achievementsData as Achievement[];
export default achievements;

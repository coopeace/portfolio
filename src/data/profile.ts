import profileData from "./profile.json";

export interface PhilosophyItem {
  title: string;
  description: string;
  icon: "Cpu" | "Terminal" | "Network" | "Layers";
}

export interface StatItem {
  label: string;
  value: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  university: string;
  location: string;
}

export interface Profile {
  name: string;
  callsign: string;
  role: string;
  title: string;
  location: string;
  coordinates: string;
  status: string;
  bio: string;
  shortBio: string;
  focusAreas: string[];
  philosophies: PhilosophyItem[];
  stats?: StatItem[];
  education?: EducationItem;
  avatarPlaceholder: string;
  avatarImage?: string;
}

// Canonical profile for Shishir Dev (Backend & Systems Developer) based in Durgapur, India.
export const profile: Profile = profileData as unknown as Profile;
export default profile;


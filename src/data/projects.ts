import projectsData from "./projects.json";

export type ProjectCategory = "Systems" | "Backend" | "Networking" | "Tools";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  github?: string;
  liveUrl?: string;
  featured: boolean;
  missionNumber: string;
  architectureHighlights: string[];
  keyChallenges: string[];
  specs: {
    runtime: string;
    protocolOrFormat: string;
    architectureType: string;
    testingStrategy: string;
  };
}

export const projects: Project[] = projectsData as unknown as Project[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export default projects;

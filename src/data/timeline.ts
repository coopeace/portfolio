import timelineData from "./timeline.json";

export interface CourseItem {
  name: string;
  grade: string;
  note?: string;
  isSecondary?: boolean;
}

export interface TimelineMilestone {
  id: string;
  period: string;
  stageBadge: string;
  title: string;
  description: string;
  isCurrent?: boolean;
  isMajorMilestone?: boolean;
  courses?: CourseItem[];
  technologies?: string[];
}

export interface DSAMilestone {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  status: "Completed" | "Current Milestone" | "Next Target";
  complexity?: string;
  topics?: string[];
  codeHighlight?: string;
}

export interface TimelineDataStructure {
  orbitalLogMilestones: TimelineMilestone[];
  dsaJourneyMilestones: DSAMilestone[];
}

const typedTimelineData = timelineData as unknown as TimelineDataStructure;

export const orbitalLogMilestones: TimelineMilestone[] =
  typedTimelineData.orbitalLogMilestones || [];

export const dsaJourneyMilestones: DSAMilestone[] =
  typedTimelineData.dsaJourneyMilestones || [];

export default orbitalLogMilestones;

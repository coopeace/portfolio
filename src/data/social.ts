import socialData from "./social.json";

export interface SocialLink {
  platform: "GitHub" | "LinkedIn" | "Email";
  label: string;
  url: string;
  icon: "Github" | "Linkedin" | "Mail";
}

export const socialLinks: SocialLink[] = socialData as SocialLink[];
export default socialLinks;

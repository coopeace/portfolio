import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { profile as defaultProfile, type Profile } from "@/data/profile";

const PROFILE_FILE_PATH = path.join(process.cwd(), "content", "profile.md");

export interface ProfileMarkdownData {
  profile: Profile;
  content: string;
}

/**
 * Loads the developer profile from content/profile.md,
 * combining YAML frontmatter attributes with the Markdown biography content.
 */
export function getProfileContent(): ProfileMarkdownData {
  if (!fs.existsSync(PROFILE_FILE_PATH)) {
    return {
      profile: defaultProfile,
      content: defaultProfile.bio,
    };
  }

  const fileContent = fs.readFileSync(PROFILE_FILE_PATH, "utf8");
  const { data, content } = matter(fileContent);

  return {
    profile: {
      ...defaultProfile,
      ...data,
      bio: content.trim() || defaultProfile.bio,
    },
    content: content.trim(),
  };
}

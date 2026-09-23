import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ABOUT_FILE_PATH = path.join(process.cwd(), "content", "about.md");

export interface AboutFrontmatter {
  title: string;
  callsign: string;
  role: string;
  status: string;
  location: string;
  academicBase: string;
  dossierStream: string;
  heading: string;
  subtitle: string;
}

export interface AboutContent {
  frontmatter: AboutFrontmatter;
  content: string;
  paragraphs: string[];
}

export function getAboutContent(): AboutContent {
  if (!fs.existsSync(ABOUT_FILE_PATH)) {
    return {
      frontmatter: {
        title: "About Shishir Dev",
        callsign: "SD-01",
        role: "Backend & Systems Developer",
        status: "MISSION ACTIVE // SYSTEMS NOMINAL",
        location: "Durgapur, India",
        academicBase: "BCA · MMMC (KNU)",
        dossierStream: "Personnel Dossier // Flight Log SD-01",
        heading: "Engineering Journey",
        subtitle: "Systems & Backend Exploration",
      },
      content: "",
      paragraphs: [],
    };
  }

  const fileContent = fs.readFileSync(ABOUT_FILE_PATH, "utf8");
  const { data, content } = matter(fileContent);

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return {
    frontmatter: {
      title: data.title || "About Shishir Dev",
      callsign: data.callsign || "SD-01",
      role: data.role || "Backend & Systems Developer",
      status: data.status || "MISSION ACTIVE // SYSTEMS NOMINAL",
      location: data.location || "Durgapur, India",
      academicBase: data.academicBase || "BCA · MMMC (KNU)",
      dossierStream: data.dossierStream || "Personnel Dossier // Flight Log SD-01",
      heading: data.heading || "Engineering Journey",
      subtitle: data.subtitle || "Systems & Backend Exploration",
    },
    content,
    paragraphs,
  };
}

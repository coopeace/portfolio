#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\x1b[36m%s\x1b[0m", "======================================================================");
console.log("\x1b[36m%s\x1b[0m", "   SHISHIR DEV PORTFOLIO — AUTOMATED MISSION VERIFICATION HARNESS   ");
console.log("\x1b[36m%s\x1b[0m", "======================================================================");
console.log();

let passedChecks = 0;
let failedChecks = 0;

function pass(name, detail = "") {
  passedChecks++;
  console.log(` \x1b[32m✔ PASS\x1b[0m \x1b[1m${name}\x1b[0m ${detail ? `\x1b[90m(${detail})\x1b[0m` : ""}`);
}

function fail(name, error) {
  failedChecks++;
  console.error(` \x1b[31m✖ FAIL\x1b[0m \x1b[1m${name}\x1b[0m: \x1b[31m${error}\x1b[0m`);
}

// 1. Core Route Files Check
console.log("\x1b[33m%s\x1b[0m", ">> [Phase 1] Validating App Router Routes & Architecture...");
const requiredRoutes = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/about/page.tsx",
  "src/app/projects/page.tsx",
  "src/app/projects/[slug]/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/api/contact/route.ts",
  "src/app/studio/page.tsx",
  "src/app/api/studio/auth/route.ts",
  "src/app/telemetry/page.tsx",
  "src/app/not-found.tsx",
  "src/app/globals.css",
];

for (const route of requiredRoutes) {
  const fullPath = path.join(rootDir, route);
  if (fs.existsSync(fullPath)) {
    pass(`Route File: ${route}`);
  } else {
    fail(`Route File: ${route}`, "File missing from disk");
  }
}

// 2. Core UI & Space Components Check
console.log();
console.log("\x1b[33m%s\x1b[0m", ">> [Phase 2] Validating Space Exploration & Navigation Components...");
const requiredComponents = [
  "src/components/navigation/Navbar.tsx",
  "src/components/navigation/MobileNav.tsx",
  "src/components/navigation/Footer.tsx",
  "src/components/navigation/ThemeSwitcher.tsx",
  "src/components/providers/ThemeProvider.tsx",
  "src/components/space/SpaceBackground.tsx",
  "src/components/space/StarField.tsx",
  "src/components/space/NebulaLayer.tsx",
  "src/components/space/MilkyWay.tsx",
  "src/components/space/ShootingStars.tsx",
  "src/components/space/OrbitalLayer.tsx",
  "src/components/space/PlanetLayer.tsx",
  "src/components/hero/Hero.tsx",
  "src/components/achievements/AchievementDashboard.tsx",
  "src/components/about/AboutPreview.tsx",
  "src/components/projects/ProjectGrid.tsx",
  "src/components/blog/BlogArticle.tsx",
  "src/components/contact/ContactForm.tsx",
];

for (const comp of requiredComponents) {
  const fullPath = path.join(rootDir, comp);
  if (fs.existsSync(fullPath)) {
    pass(`Component: ${comp}`);
  } else {
    fail(`Component: ${comp}`, "Component missing");
  }
}

// 3. Data Integrity & Anti-Fabrication Check
console.log();
console.log("\x1b[33m%s\x1b[0m", ">> [Phase 3] Enforcing Data Integrity & Anti-Fabrication Constraints...");
try {
  const socialContent = fs.existsSync(path.join(rootDir, "src/data/social.json"))
    ? fs.readFileSync(path.join(rootDir, "src/data/social.json"), "utf8")
    : fs.readFileSync(path.join(rootDir, "src/data/social.ts"), "utf8");

  if (socialContent.includes("https://github.com/coopeace")) {
    pass("Social Data: GitHub profile URL matches coopeace");
  } else {
    fail("Social Data: GitHub profile URL", "Expected coopeace GitHub link");
  }

  if (socialContent.includes("linkedin.com/in/shishir-dev")) {
    pass("Social Data: LinkedIn profile URL verified");
  } else {
    fail("Social Data: LinkedIn profile URL", "Expected genuine LinkedIn link");
  }

  const profileContent = fs.existsSync(path.join(rootDir, "src/data/profile.json"))
    ? fs.readFileSync(path.join(rootDir, "src/data/profile.json"), "utf8")
    : fs.readFileSync(path.join(rootDir, "src/data/profile.ts"), "utf8");

  if (profileContent.includes("Shishir Dev") && profileContent.includes("Durgapur")) {
    pass("Profile Data: Name & Durgapur location verified");
  } else {
    fail("Profile Data", "Shishir Dev and Durgapur location missing");
  }

  const achievementsContent = fs.existsSync(path.join(rootDir, "src/data/achievements.json"))
    ? fs.readFileSync(path.join(rootDir, "src/data/achievements.json"), "utf8")
    : fs.readFileSync(path.join(rootDir, "src/data/achievements.ts"), "utf8");

  if (achievementsContent.includes("LeetCode") && achievementsContent.includes("NeetCode") && achievementsContent.includes("HackerRank")) {
    pass("Achievements Data: Platforms verified with baseline metrics");
  } else {
    fail("Achievements Data", "Expected LeetCode, NeetCode, and HackerRank");
  }
} catch (err) {
  fail("Data Layer Verification", err.message);
}

// 4. MDX Blog Content Pipeline Check
console.log();
console.log("\x1b[33m%s\x1b[0m", ">> [Phase 4] Validating MDX Blog Content Pipeline...");
const blogDir = path.join(rootDir, "content", "blog");
if (fs.existsSync(blogDir)) {
  const mdxFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  if (mdxFiles.length >= 3) {
    pass(`MDX Articles Count: ${mdxFiles.length} articles found`);
    for (const file of mdxFiles) {
      const content = fs.readFileSync(path.join(blogDir, file), "utf8");
      if (content.startsWith("---") && content.includes("title:") && content.includes("date:")) {
        pass(`MDX Article Frontmatter: ${file}`);
      } else {
        fail(`MDX Article Frontmatter: ${file}`, "Missing standard frontmatter");
      }
    }
  } else {
    fail("MDX Articles", `Expected at least 3 articles, found ${mdxFiles.length}`);
  }
} else {
  fail("MDX Directory", "content/blog directory does not exist");
}

// 5. Contact API Route & Validation Check
console.log();
console.log("\x1b[33m%s\x1b[0m", ">> [Phase 5] Validating Zod Schema & Truthful API Handling...");
try {
  const validationContent = fs.readFileSync(path.join(rootDir, "src/lib/validation.ts"), "utf8");
  if (validationContent.includes("contactFormSchema") && validationContent.includes("z.object")) {
    pass("Zod Validation Schema: contactFormSchema present");
  } else {
    fail("Zod Validation Schema", "Missing schema in src/lib/validation.ts");
  }

  const apiRouteContent = fs.readFileSync(path.join(rootDir, "src/app/api/contact/route.ts"), "utf8");
  if (apiRouteContent.includes("contactFormSchema.safeParse") && apiRouteContent.includes("NextResponse.json")) {
    pass("API Handler: Zod safeParse and truthful response handling verified");
  } else {
    fail("API Handler", "Missing safeParse or response in route.ts");
  }
} catch (err) {
  fail("Contact System Verification", err.message);
}

// 6. Summary Report
console.log();
console.log("\x1b[36m%s\x1b[0m", "======================================================================");
console.log(` TELEMETRY SUMMARY: \x1b[32m${passedChecks} PASSED\x1b[0m | \x1b[31m${failedChecks} FAILED\x1b[0m`);
console.log("\x1b[36m%s\x1b[0m", "======================================================================");

if (failedChecks > 0) {
  console.error("\x1b[31m%s\x1b[0m", "Mission verification FAILED. Please resolve errors above.");
  process.exit(1);
} else {
  console.log("\x1b[32m%s\x1b[0m", "All mission architecture checks NOMINAL. Flight parameters verified.");
  process.exit(0);
}

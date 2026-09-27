import fs from "fs";
import path from "path";

export interface FileToPersist {
  relativePath: string; // e.g. "src/data/achievements.json"
  content: string;
}

export interface PersistenceResult {
  success: boolean;
  mode: "local" | "github";
  message: string;
  commitUrl?: string;
  error?: string;
  needsTokenSetup?: boolean;
}

/**
 * Checks if the current execution environment is a serverless environment (e.g. Vercel / AWS Lambda)
 * where the filesystem at /var/task is read-only.
 */
export function isServerlessEnvironment(): boolean {
  return Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );
}

/**
 * Persists one or more files either directly to disk (in local development)
 * or to the GitHub repository via GitHub Contents API (in production on Vercel).
 */
export async function persistStudioFiles(
  files: FileToPersist[],
  commitMessage: string
): Promise<PersistenceResult> {
  const isServerless = isServerlessEnvironment();

  // 1. LOCAL DEVELOPMENT: Write directly to filesystem
  if (!isServerless) {
    try {
      for (const file of files) {
        const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), file.relativePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, file.content, "utf8");
      }

      return {
        success: true,
        mode: "local",
        message: "Successfully synchronized changes directly to local disk.",
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Disk write failed";
      return {
        success: false,
        mode: "local",
        error: errorMsg,
        message: `Failed to write file to local disk: ${errorMsg}`,
      };
    }
  }

  // 2. PRODUCTION / SERVERLESS: GitHub Contents API Commit
  const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_REPO_OWNER || "coopeace";
  const repo = process.env.GITHUB_REPO_NAME || "portfolio";
  const branch = process.env.GITHUB_REPO_BRANCH || "main";

  if (!githubToken || githubToken.trim().length === 0) {
    return {
      success: false,
      mode: "github",
      needsTokenSetup: true,
      error: "Missing GITHUB_TOKEN environment variable",
      message:
        "Vercel runs on a read-only serverless file system. To enable live updates from Studio, configure GITHUB_TOKEN in your Vercel Project Settings (with repository read/write access), or perform updates in local development.",
    };
  }

  try {
    let lastCommitUrl: string | undefined;

    for (const file of files) {
      // Normalize relative path (remove leading slash if present)
      const cleanPath = file.relativePath.replace(/^\/+/, "");
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`;

      // Step A: Fetch existing file SHA if file already exists
      let sha: string | undefined;
      const getRes = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "ShishirDev-MissionControlStudio/1.1.0",
        },
        cache: "no-store",
      });

      if (getRes.ok) {
        const getData = (await getRes.json()) as { sha?: string };
        sha = getData.sha;
      } else if (getRes.status !== 404) {
        const errorText = await getRes.text();
        throw new Error(
          `GitHub API lookup failed for ${cleanPath} (Status ${getRes.status}): ${errorText}`
        );
      }

      // Step B: Put/update file content
      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken.trim()}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "ShishirDev-MissionControlStudio/1.1.0",
          },
          body: JSON.stringify({
            message: commitMessage,
            content: Buffer.from(file.content, "utf8").toString("base64"),
            branch,
            ...(sha ? { sha } : {}),
          }),
        }
      );

      if (!putRes.ok) {
        const errorText = await putRes.text();
        throw new Error(
          `GitHub API commit failed for ${cleanPath} (Status ${putRes.status}): ${errorText}`
        );
      }

      const putData = (await putRes.json()) as {
        commit?: { html_url?: string };
      };
      if (putData.commit?.html_url) {
        lastCommitUrl = putData.commit.html_url;
      }
    }

    return {
      success: true,
      mode: "github",
      commitUrl: lastCommitUrl,
      message: `Committed changes to GitHub branch '${branch}'! Vercel is building and deploying the updates.`,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "GitHub commit failed";
    return {
      success: false,
      mode: "github",
      error: errorMsg,
      message: `GitHub commit transmission error: ${errorMsg}`,
    };
  }
}

/**
 * Convenience helper for persisting a single file.
 */
export async function persistStudioFile(
  relativePath: string,
  content: string,
  commitMessage: string
): Promise<PersistenceResult> {
  return persistStudioFiles([{ relativePath, content }], commitMessage);
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Terminal,
  BookOpen,
  FolderGit2,
  Cpu,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  PenTool,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Lock,
  Key,
  ShieldCheck,
  LogOut,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { TelemetrySyncEditor } from "@/components/studio/TelemetrySyncEditor";
import { TimelineEditor } from "@/components/studio/TimelineEditor";

type StudioTab = "blog" | "project" | "telemetry" | "timeline";

export default function StudioPage() {
  const [activeTab, setActiveTab] = React.useState<StudioTab>("blog");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
    url?: string;
  } | null>(null);

  // ----------------------------------------------------
  // Authentication State
  // ----------------------------------------------------
  const [authChecking, setAuthChecking] = React.useState(true);
  const [isAuthRequired, setIsAuthRequired] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/studio/auth");
        const data = await res.json();
        setIsAuthRequired(Boolean(data.isAuthRequired));
        setIsAuthenticated(Boolean(data.isAuthenticated));
      } catch {
        setIsAuthRequired(false);
        setIsAuthenticated(true);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();

    // Prevent default browser behavior of navigating to dropped files (file:///)
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("dragover", handleGlobalDragOver);
    window.addEventListener("drop", handleGlobalDrop);

    return () => {
      window.removeEventListener("dragover", handleGlobalDragOver);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
      } else {
        setAuthError(data.message || "Invalid clearance code.");
      }
    } catch {
      setAuthError("Failed to communicate with authentication gateway.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setIsAuthenticated(false);
    } catch {
      // Ignore
    }
  };

  // ----------------------------------------------------
  // Blog State
  // ----------------------------------------------------
  const [blogTitle, setBlogTitle] = React.useState("");
  const [blogSlug, setBlogSlug] = React.useState("");
  const [blogDesc, setBlogDesc] = React.useState("");
  const [blogCategory, setBlogCategory] = React.useState("Systems");
  const [blogTags, setBlogTags] = React.useState("Python, Linux, Systems");
  const [blogReadTime, setBlogReadTime] = React.useState("5 min read");
  const [blogFeatured, setBlogFeatured] = React.useState(false);
  const [blogContent, setBlogContent] = React.useState(
    "## 1. Introduction\n\nExplain the mission parameters and core technical problem.\n\n```python\ndef execute():\n    return 'Telemetry active'\n```\n\n## 2. Architecture & Implementation\n\nDetail the algorithmic or system mechanics here."
  );
  const [blogPreviewMode, setBlogPreviewMode] = React.useState(false);

  // Auto-generate slug from title
  const handleBlogTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlogTitle(title);
    setBlogSlug(
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  // Image Upload for Blog
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDropzoneActive, setIsDropzoneActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File, folder: "blog" | "projects") => {
    setIsUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        if (folder === "blog") {
          setBlogContent((prev) => `${prev}\n\n![${file.name}](${data.url})\n`);
        }
        setFeedback({
          type: "success",
          message: `Image uploaded to ${data.url} and inserted into editor!`,
        });
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Image upload failed.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to upload image. Network error.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "blog" | "projects"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, folder);
    }
  };

  // Submit Blog
  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/studio/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          slug: blogSlug,
          description: blogDesc,
          category: blogCategory,
          tags: blogTags.split(",").map((s) => s.trim()),
          readTime: blogReadTime,
          featured: blogFeatured,
          content: blogContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message: data.message,
          url: data.url,
        });
        setBlogTitle("");
        setBlogSlug("");
        setBlogDesc("");
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to publish blog post.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Transmission error while publishing blog.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Project State
  // ----------------------------------------------------
  const [projName, setProjName] = React.useState("");
  const [projSlug, setProjSlug] = React.useState("");
  const [projTagline, setProjTagline] = React.useState("");
  const [projCategory, setProjCategory] = React.useState<
    "Systems" | "Backend" | "Networking" | "Tools"
  >("Systems");
  const [projDesc, setProjDesc] = React.useState("");
  const [projTech, setProjTech] = React.useState("Python, Linux, Sockets");
  const [projGithub, setProjGithub] = React.useState(
    "https://github.com/coopeace"
  );
  const [projLiveUrl, setProjLiveUrl] = React.useState("");
  const [projFeatured, setProjFeatured] = React.useState(true);
  const [projHighlights, setProjHighlights] = React.useState(
    "Zero-copy socket reading via raw kernel packets.\nBinary header parsing with Python struct module."
  );
  const [projChallenges, setProjChallenges] = React.useState(
    "Handling high throughput on gigabit interfaces without dropping frames."
  );

  const handleProjNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProjName(name);
    setProjSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handlePublishProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/studio/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projName,
          slug: projSlug,
          tagline: projTagline,
          description: projDesc,
          category: projCategory,
          technologies: projTech.split(",").map((s) => s.trim()),
          github: projGithub,
          liveUrl: projLiveUrl || undefined,
          featured: projFeatured,
          architectureHighlights: projHighlights
            .split("\n")
            .filter((s) => s.trim().length > 0),
          keyChallenges: projChallenges
            .split("\n")
            .filter((s) => s.trim().length > 0),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message: data.message,
          url: data.url,
        });
        setProjName("");
        setProjSlug("");
        setProjTagline("");
        setProjDesc("");
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to publish project.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Transmission error while publishing project.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  if (authChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center space-x-3 font-mono text-sm text-accent">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>INITIALIZING MISSION SECURITY GATEWAY...</span>
        </div>
      </div>
    );
  }

  if (isAuthRequired && !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-panel border border-border bg-surface shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-accent/10 border border-accent/30 text-accent mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              Ground Station Security Clearance
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Mission Control Studio
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              This terminal is locked. Please enter your operator clearance passcode to access publishing systems.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Clearance Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter STUDIO_PASSWORD"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Key className="w-4 h-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 font-mono text-xs text-red-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full space-x-2 font-mono text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate Session</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-border/40 text-center font-mono text-[11px] text-muted/70 space-y-1">
            <p>Station Operator: Shishir Dev [SD-01]</p>
            <p>Configurable via STUDIO_PASSWORD in environment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 overflow-x-hidden">
      {/* Studio Banner */}
      <header className="pb-8 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Mission Control // Creator Deck &amp; Content Studio</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Creator Studio
            </h1>
            <p className="text-muted text-sm sm:text-base mt-1">
              Easily compose blog dispatches, deploy new project dossiers, or update telemetry metrics through a visual dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:space-x-3">
            {isAuthRequired && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="font-mono text-xs space-x-1.5 border-border hover:border-red-500/50 hover:text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Studio</span>
              </Button>
            )}

            <Link href="/">
              <Button variant="secondary" className="font-mono text-xs space-x-1.5">
                <span>Exit to Launchpad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("blog");
              setFeedback(null);
            }}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all",
              activeTab === "blog"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-surface-elevated text-muted hover:text-foreground border border-border/60"
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>Compose Article (MDX)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("project");
              setFeedback(null);
            }}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all",
              activeTab === "project"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-surface-elevated text-muted hover:text-foreground border border-border/60"
            )}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Deploy Project</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("telemetry");
              setFeedback(null);
            }}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all",
              activeTab === "telemetry"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-surface-elevated text-muted hover:text-foreground border border-border/60"
            )}
          >
            <Cpu className="w-4 h-4" />
            <span>Telemetry &amp; Metrics</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("timeline");
              setFeedback(null);
            }}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all",
              activeTab === "timeline"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-surface-elevated text-muted hover:text-foreground border border-border/60"
            )}
          >
            <Compass className="w-4 h-4" />
            <span>Timeline &amp; Milestones</span>
          </button>
        </div>
      </header>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "p-4 rounded-lg border font-mono text-xs flex items-center justify-between gap-4",
            feedback.type === "success"
              ? "bg-success/10 border-success/40 text-foreground"
              : "bg-red-500/10 border-red-500/40 text-foreground"
          )}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          {feedback.url && (
            <Link
              href={feedback.url}
              className="inline-flex items-center space-x-1 font-bold text-accent hover:underline flex-shrink-0"
            >
              <span>View Published Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. BLOG COMPOSE TAB */}
      {/* ==================================================== */}
      {activeTab === "blog" && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/40">
            <div>
              <h2 className="text-xl font-bold font-mono text-foreground">
                Article Editor // MDX Pipeline
              </h2>
              <p className="text-xs text-muted">
                Author new technical log entries. When submitted, the system writes the .mdx file directly to content/blog/.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setBlogPreviewMode(false)}
                className={cn(
                  "px-3 py-1.5 rounded font-mono text-xs font-medium flex items-center space-x-1",
                  !blogPreviewMode
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Compose</span>
              </button>
              <button
                type="button"
                onClick={() => setBlogPreviewMode(true)}
                className={cn(
                  "px-3 py-1.5 rounded font-mono text-xs font-medium flex items-center space-x-1",
                  blogPreviewMode
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Card Preview</span>
              </button>
            </div>
          </div>

          {!blogPreviewMode ? (
            <form onSubmit={handlePublishBlog} className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Article Title <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={handleBlogTitleChange}
                    placeholder="e.g. Deep Dive into Linux Network Namespaces"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    URL Slug <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    placeholder="e.g. deep-dive-linux-namespaces"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Category, Tags, Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Category
                  </label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Systems">Systems</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Networking">Networking</option>
                    <option value="Backend">Backend</option>
                    <option value="Linux">Linux</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="Python, Linux, Sockets"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    placeholder="6 min read"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Executive Summary / Abstract
                </label>
                <textarea
                  rows={2}
                  required
                  value={blogDesc}
                  onChange={(e) => setBlogDesc(e.target.value)}
                  placeholder="A concise 1-2 sentence overview of the technical concepts covered..."
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              </div>

              {/* Image Upload Toolbar */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDropzoneActive(true);
                }}
                onDragLeave={() => setIsDropzoneActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDropzoneActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    uploadFile(file, "blog");
                  }
                }}
                className={cn(
                  "p-4 rounded-lg bg-surface border transition-all flex flex-wrap items-center justify-between gap-4",
                  isDropzoneActive
                    ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                    : "border-border"
                )}
              >
                <div className="flex items-center space-x-2 text-xs font-mono text-muted min-w-0 max-w-full">
                  <ImageIcon className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="break-words">
                    {isDropzoneActive
                      ? "Drop image file here to upload"
                      : "Attach Media (Drag & drop image or upload):"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "blog")}
                    className="hidden"
                    id="blog-image-upload"
                  />
                  <label
                    htmlFor="blog-image-upload"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-accent text-foreground font-mono text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {isUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload Local Image"}</span>
                  </label>
                </div>
              </div>

              {/* Markdown Content Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Article Body (Markdown &amp; MDX) <span className="text-accent">*</span>
                  </label>
                  <span className="font-mono text-[11px] text-muted">
                    Supports Python, C, Bash syntax highlighting &amp; math
                  </span>
                </div>
                <textarea
                  rows={14}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      e.preventDefault();
                      e.stopPropagation();
                      uploadFile(file, "blog");
                    }
                  }}
                  className="w-full p-4 rounded-lg bg-[#050816] text-[#E2E8F0] border border-border font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              </div>

              {/* Featured toggle & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/40">
                <label className="flex items-center space-x-2 cursor-pointer font-mono text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={blogFeatured}
                    onChange={(e) => setBlogFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span>Showcase as Featured Dispatch on Homepage</span>
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="space-x-2 font-mono text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Writing to Disk...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Mission Log</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Live Card Preview */
            <div className="space-y-6">
              <h3 className="font-mono text-xs uppercase text-muted">
                {"// Live Blog Card Preview"}
              </h3>
              <div className="max-w-md p-6 rounded-panel border border-border bg-surface shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-xs text-muted">
                  <span className="text-accent font-semibold uppercase">
                    {blogCategory}
                  </span>
                  <span>{blogReadTime}</span>
                </div>
                <h4 className="text-xl font-bold text-foreground mt-4">
                  {blogTitle || "Article Title Preview"}
                </h4>
                <p className="text-muted text-sm mt-2 leading-relaxed">
                  {blogDesc || "Your executive summary will appear here..."}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {blogTags.split(",").map((tag) => (
                    <Badge key={tag} variant="tech" tech={tag.trim()} size="sm">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. PROJECT DEPLOY TAB */}
      {/* ==================================================== */}
      {activeTab === "project" && (
        <form onSubmit={handlePublishProject} className="space-y-6">
          <div className="pb-2 border-b border-border/40">
            <h2 className="text-xl font-bold font-mono text-foreground">
              New Mission Dossier // Project Database
            </h2>
            <p className="text-xs text-muted">
              Add a new engineering system or tool. Submissions are saved directly into src/data/projects.json.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Project Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={projName}
                onChange={handleProjNameChange}
                placeholder="e.g. NetFlow Analyzer"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                URL Slug <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={projSlug}
                onChange={(e) => setProjSlug(e.target.value)}
                placeholder="e.g. netflow-analyzer"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={projTagline}
                onChange={(e) => setProjTagline(e.target.value)}
                placeholder="High-Throughput Linux Packet Capture Service"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Category
              </label>
              <select
                value={projCategory}
                onChange={(e) =>
                  setProjCategory(
                    e.target.value as "Systems" | "Backend" | "Networking" | "Tools"
                  )
                }
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Systems">Systems</option>
                <option value="Backend">Backend</option>
                <option value="Networking">Networking</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase text-foreground font-semibold">
              Description <span className="text-accent">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              placeholder="Comprehensive architectural overview of what the project accomplishes and how it functions..."
              className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Technologies (Comma Separated)
              </label>
              <input
                type="text"
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
                placeholder="Python, Linux, Docker"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={projGithub}
                onChange={(e) => setProjGithub(e.target.value)}
                placeholder="https://github.com/coopeace/repo"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Live URL (Optional)
              </label>
              <input
                type="text"
                value={projLiveUrl}
                onChange={(e) => setProjLiveUrl(e.target.value)}
                placeholder="https://live-url.systems"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Architecture Highlights (One per line)
              </label>
              <textarea
                rows={3}
                value={projHighlights}
                onChange={(e) => setProjHighlights(e.target.value)}
                placeholder="High performance binary parser..."
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Key Challenges (One per line)
              </label>
              <textarea
                rows={3}
                value={projChallenges}
                onChange={(e) => setProjChallenges(e.target.value)}
                placeholder="Torn-write recovery..."
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/40">
            <label className="flex items-center space-x-2 cursor-pointer font-mono text-xs text-foreground">
              <input
                type="checkbox"
                checked={projFeatured}
                onChange={(e) => setProjFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent"
              />
              <span>Feature on Homepage Dossier</span>
            </label>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="space-x-2 font-mono text-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <>
                  <FolderGit2 className="w-4 h-4" />
                  <span>Deploy Project Dossier</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* ==================================================== */}
      {/* 3. TELEMETRY & METRICS SYNC TAB */}
      {/* ==================================================== */}
      {activeTab === "telemetry" && <TelemetrySyncEditor />}

      {/* ==================================================== */}
      {/* 4. TIMELINE & MILESTONES MANAGER TAB */}
      {/* ==================================================== */}
      {activeTab === "timeline" && <TimelineEditor />}
    </div>
  );
}

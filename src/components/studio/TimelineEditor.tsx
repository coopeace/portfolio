"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Code2,
  Plus,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  type TimelineMilestone,
  type CourseItem,
  type DSAMilestone,
  orbitalLogMilestones as defaultOrbitalMilestones,
  dsaJourneyMilestones as defaultDsaMilestones,
} from "@/data/timeline";

export function TimelineEditor() {
  const [timelineMode, setTimelineMode] = React.useState<"orbital" | "dsa">(
    "orbital"
  );
  const [orbitalMilestones, setOrbitalMilestones] = React.useState<
    TimelineMilestone[]
  >(defaultOrbitalMilestones);
  const [dsaMilestones, setDsaMilestones] = React.useState<DSAMilestone[]>(
    defaultDsaMilestones
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ----------------------------------------------------
  // Orbital Form State (For Add / Edit)
  // ----------------------------------------------------
  const [editingOrbitalId, setEditingOrbitalId] = React.useState<string | null>(
    null
  );
  const [orbitalPeriod, setOrbitalPeriod] = React.useState("");
  const [orbitalStageBadge, setOrbitalStageBadge] = React.useState("CORE CURRICULUM");
  const [orbitalTitle, setOrbitalTitle] = React.useState("");
  const [orbitalDesc, setOrbitalDesc] = React.useState("");
  const [orbitalIsCurrent, setOrbitalIsCurrent] = React.useState(false);
  const [orbitalIsMajor, setOrbitalIsMajor] = React.useState(false);
  const [orbitalCourses, setOrbitalCourses] = React.useState<CourseItem[]>([]);
  const [orbitalTechInput, setOrbitalTechInput] = React.useState("");

  // Course sub-form temporary state
  const [courseName, setCourseName] = React.useState("");
  const [courseGrade, setCourseGrade] = React.useState("A+");
  const [courseNote, setCourseNote] = React.useState("");
  const [courseIsSecondary, setCourseIsSecondary] = React.useState(false);

  // ----------------------------------------------------
  // DSA Form State (For Add / Edit)
  // ----------------------------------------------------
  const [editingDsaId, setEditingDsaId] = React.useState<string | null>(null);
  const [dsaStep, setDsaStep] = React.useState("");
  const [dsaBadge, setDsaBadge] = React.useState("CORE STRUCTURES");
  const [dsaTitle, setDsaTitle] = React.useState("");
  const [dsaDesc, setDsaDesc] = React.useState("");
  const [dsaStatus, setDsaStatus] = React.useState<
    "Completed" | "Current Milestone" | "Next Target"
  >("Completed");
  const [dsaComplexity, setDsaComplexity] = React.useState("O(n) Time · O(n) Space");
  const [dsaTopicsInput, setDsaTopicsInput] = React.useState("");
  const [dsaCodeHighlight, setDsaCodeHighlight] = React.useState("");

  // Fetch timeline data from disk
  const loadTimelineData = React.useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/studio/timeline");
      const data = await res.json();
      if (data.success) {
        setOrbitalMilestones(data.orbitalLogMilestones || []);
        setDsaMilestones(data.dsaJourneyMilestones || []);
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to load timeline data.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to connect to timeline API.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTimelineData();
  }, [loadTimelineData]);

  // ----------------------------------------------------
  // Orbital Handlers
  // ----------------------------------------------------
  const resetOrbitalForm = () => {
    setEditingOrbitalId(null);
    setOrbitalPeriod("");
    setOrbitalStageBadge("CORE CURRICULUM");
    setOrbitalTitle("");
    setOrbitalDesc("");
    setOrbitalIsCurrent(false);
    setOrbitalIsMajor(false);
    setOrbitalCourses([]);
    setOrbitalTechInput("");
  };

  const startEditOrbital = (milestone: TimelineMilestone) => {
    setEditingOrbitalId(milestone.id);
    setOrbitalPeriod(milestone.period);
    setOrbitalStageBadge(milestone.stageBadge);
    setOrbitalTitle(milestone.title);
    setOrbitalDesc(milestone.description);
    setOrbitalIsCurrent(Boolean(milestone.isCurrent));
    setOrbitalIsMajor(Boolean(milestone.isMajorMilestone));
    setOrbitalCourses(milestone.courses ? [...milestone.courses] : []);
    setOrbitalTechInput(milestone.technologies ? milestone.technologies.join(", ") : "");
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    setOrbitalCourses((prev) => [
      ...prev,
      {
        name: courseName.trim(),
        grade: courseGrade,
        note: courseNote.trim() || undefined,
        isSecondary: courseIsSecondary,
      },
    ]);
    setCourseName("");
    setCourseNote("");
    setCourseIsSecondary(false);
  };

  const handleRemoveCourse = (idx: number) => {
    setOrbitalCourses((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveOrbitalMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orbitalTitle.trim() || !orbitalPeriod.trim()) return;

    const id =
      editingOrbitalId ||
      orbitalTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newMilestone: TimelineMilestone = {
      id,
      period: orbitalPeriod.trim(),
      stageBadge: orbitalStageBadge.trim().toUpperCase(),
      title: orbitalTitle.trim(),
      description: orbitalDesc.trim(),
      isCurrent: orbitalIsCurrent || undefined,
      isMajorMilestone: orbitalIsMajor || undefined,
      courses: orbitalCourses.length > 0 ? orbitalCourses : undefined,
      technologies: orbitalTechInput.trim()
        ? orbitalTechInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    };

    if (editingOrbitalId) {
      setOrbitalMilestones((prev) =>
        prev.map((m) => (m.id === editingOrbitalId ? newMilestone : m))
      );
    } else {
      setOrbitalMilestones((prev) => [...prev, newMilestone]);
    }
    resetOrbitalForm();
  };

  const handleDeleteOrbital = (id: string) => {
    setOrbitalMilestones((prev) => prev.filter((m) => m.id !== id));
    if (editingOrbitalId === id) resetOrbitalForm();
  };

  const handleMoveOrbital = (idx: number, direction: "up" | "down") => {
    setOrbitalMilestones((prev) => {
      const copy = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // ----------------------------------------------------
  // DSA Handlers
  // ----------------------------------------------------
  const resetDsaForm = () => {
    setEditingDsaId(null);
    setDsaStep("");
    setDsaBadge("CORE STRUCTURES");
    setDsaTitle("");
    setDsaDesc("");
    setDsaStatus("Completed");
    setDsaComplexity("O(n) Time · O(n) Space");
    setDsaTopicsInput("");
    setDsaCodeHighlight("");
  };

  const startEditDsa = (item: DSAMilestone) => {
    setEditingDsaId(item.id);
    setDsaStep(item.step);
    setDsaBadge(item.badge);
    setDsaTitle(item.title);
    setDsaDesc(item.description);
    setDsaStatus(item.status);
    setDsaComplexity(item.complexity || "");
    setDsaTopicsInput(item.topics ? item.topics.join(", ") : "");
    setDsaCodeHighlight(item.codeHighlight || "");
  };

  const handleSaveDsaMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsaTitle.trim() || !dsaStep.trim()) return;

    const id =
      editingDsaId ||
      dsaTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newMilestone: DSAMilestone = {
      id,
      step: dsaStep.trim(),
      badge: dsaBadge.trim().toUpperCase(),
      title: dsaTitle.trim(),
      description: dsaDesc.trim(),
      status: dsaStatus,
      complexity: dsaComplexity.trim() || undefined,
      topics: dsaTopicsInput.trim()
        ? dsaTopicsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
      codeHighlight: dsaCodeHighlight.trim() || undefined,
    };

    if (editingDsaId) {
      setDsaMilestones((prev) =>
        prev.map((m) => (m.id === editingDsaId ? newMilestone : m))
      );
    } else {
      setDsaMilestones((prev) => [...prev, newMilestone]);
    }
    resetDsaForm();
  };

  const handleDeleteDsa = (id: string) => {
    setDsaMilestones((prev) => prev.filter((m) => m.id !== id));
    if (editingDsaId === id) resetDsaForm();
  };

  const handleMoveDsa = (idx: number, direction: "up" | "down") => {
    setDsaMilestones((prev) => {
      const copy = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // ----------------------------------------------------
  // Global Save to Disk
  // ----------------------------------------------------
  const handleSaveAllToDisk = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/studio/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orbitalLogMilestones: orbitalMilestones,
          dsaJourneyMilestones: dsaMilestones,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message:
            "Timeline milestones synchronized successfully! All public views updated.",
        });
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to commit milestones to disk.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error occurred while saving timeline milestones.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 rounded-xl border border-border bg-surface/50 font-mono text-sm text-muted">
        <RefreshCw className="w-6 h-6 text-accent animate-spin" />
        <span>Loading persistent timeline milestones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-accent" />
            <span>Mission Dossier // Visual Timeline Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            Timeline &amp; Milestone Manager
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
            Design and curate the vertical Orbital Log and DSA Progression milestones with instant WYSIWYG previews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={loadTimelineData}
            disabled={isSaving}
            className="space-x-1.5 font-mono text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert Unsaved</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveAllToDisk}
            disabled={isSaving}
            className="space-x-1.5 font-mono text-xs"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Commit to timeline.json</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-lg font-mono text-xs flex flex-wrap items-center justify-between gap-2 border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
              : "bg-red-950/40 border-red-500/50 text-red-400"
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/about"
              target="_blank"
              className="underline hover:text-foreground inline-flex items-center space-x-1"
            >
              <span>View About Log</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/telemetry"
              target="_blank"
              className="underline hover:text-foreground inline-flex items-center space-x-1"
            >
              <span>View DSA Rail</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Sub-Tab Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setTimelineMode("orbital")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            timelineMode === "orbital"
              ? "bg-accent/15 text-accent font-semibold border border-accent/30"
              : "text-muted hover:text-foreground hover:bg-surface-elevated"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Orbital Log (Academic &amp; Coursework)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded bg-surface border border-border text-[10px]">
            {orbitalMilestones.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTimelineMode("dsa")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            timelineMode === "dsa"
              ? "bg-accent/15 text-accent font-semibold border border-accent/30"
              : "text-muted hover:text-foreground hover:bg-surface-elevated"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>DSA Journey Rail (Two Sum &amp; Algorithms)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded bg-surface border border-border text-[10px]">
            {dsaMilestones.length}
          </span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* 1. ORBITAL LOG SUB-EDITOR */}
      {/* ==================================================== */}
      {timelineMode === "orbital" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Milestone List Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                Milestones in Sequence ({orbitalMilestones.length})
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetOrbitalForm}
                className="space-x-1 font-mono text-xs text-accent"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Milestone</span>
              </Button>
            </div>

            <div className="space-y-3">
              {orbitalMilestones.map((milestone, idx) => {
                const isSelected = editingOrbitalId === milestone.id;
                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "border-accent bg-accent/5 shadow-sm ring-1 ring-accent/30"
                        : "border-border bg-surface hover:border-border-hover"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-elevated border border-border text-accent font-semibold">
                            {milestone.period}
                          </span>
                          <span className="font-mono text-[10px] text-muted tracking-wider uppercase">
                            {milestone.stageBadge}
                          </span>
                          {milestone.isMajorMilestone && (
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              MAJOR
                            </span>
                          )}
                          {milestone.isCurrent && (
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-muted line-clamp-2">
                          {milestone.description}
                        </p>
                        {milestone.courses && milestone.courses.length > 0 && (
                          <div className="font-mono text-[10px] text-muted/80 pt-1">
                            {milestone.courses.length} Course(s) Recorded
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveOrbital(idx, "up")}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1 rounded text-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrbital(idx, "down")}
                            disabled={idx === orbitalMilestones.length - 1}
                            title="Move Down"
                            className="p-1 rounded text-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => startEditOrbital(milestone)}
                            title="Edit Milestone"
                            className="p-1 rounded text-muted hover:text-accent"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrbital(milestone.id)}
                            title="Delete Milestone"
                            className="p-1 rounded text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Milestone Builder & Live Preview Column */}
          <div className="lg:col-span-7 space-y-6">
            <form
              onSubmit={handleSaveOrbitalMilestone}
              className="p-6 rounded-panel border border-border bg-surface/90 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center space-x-2 font-mono text-xs text-foreground font-semibold">
                  <Edit3 className="w-4 h-4 text-accent" />
                  <span>
                    {editingOrbitalId
                      ? `Editing: ${orbitalTitle || "Milestone"}`
                      : "Create New Orbital Milestone"}
                  </span>
                </div>
                {editingOrbitalId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetOrbitalForm}
                    className="font-mono text-xs text-muted"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Period Label <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={orbitalPeriod}
                    onChange={(e) => setOrbitalPeriod(e.target.value)}
                    placeholder="e.g. 2024 or Year 01"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Stage Badge Label
                  </label>
                  <input
                    type="text"
                    value={orbitalStageBadge}
                    onChange={(e) => setOrbitalStageBadge(e.target.value)}
                    placeholder="e.g. CORE CURRICULUM or MAJOR MILESTONE"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Milestone Title <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orbitalTitle}
                  onChange={(e) => setOrbitalTitle(e.target.value)}
                  placeholder="e.g. Programming Foundations"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={orbitalDesc}
                  onChange={(e) => setOrbitalDesc(e.target.value)}
                  placeholder="Summary of knowledge gained, focus areas, and development during this period..."
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-1 font-mono text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-foreground">
                  <input
                    type="checkbox"
                    checked={orbitalIsMajor}
                    onChange={(e) => setOrbitalIsMajor(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span>Major Landmark (Glowing Node)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-foreground">
                  <input
                    type="checkbox"
                    checked={orbitalIsCurrent}
                    onChange={(e) => setOrbitalIsCurrent(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span>Current Active Station</span>
                </label>
              </div>

              {/* Coursework Builder */}
              <div className="p-4 rounded-lg border border-border/70 bg-surface-elevated/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                    Academic Course Rows ({orbitalCourses.length})
                  </span>
                </div>

                {orbitalCourses.length > 0 && (
                  <div className="space-y-2">
                    {orbitalCourses.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 p-2.5 rounded bg-surface border border-border font-mono text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground">
                            {c.name}
                          </span>
                          {c.note && (
                            <span className="text-muted text-[11px] block">
                              {c.note}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-emerald-400 font-bold">
                            {c.grade}
                          </span>
                          {c.isSecondary && (
                            <span className="text-[10px] text-muted uppercase">
                              (Secondary)
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(i)}
                            className="text-muted hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Course Sub-form */}
                <div className="pt-2 border-t border-border/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Course Name (e.g. Operating Systems)"
                        className="w-full px-3 py-1.5 rounded bg-surface border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={courseGrade}
                        onChange={(e) => setCourseGrade(e.target.value)}
                        className="w-full px-2 py-1.5 rounded bg-surface border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="O">O (Outstanding)</option>
                        <option value="A+">A+ (Excellent)</option>
                        <option value="A">A (Very Good)</option>
                        <option value="B+">B+ (Good)</option>
                        <option value="B">B (Above Average)</option>
                        <option value="P">P (Pass)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddCourse}
                        className="w-full font-mono text-xs"
                      >
                        + Add Row
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={courseNote}
                      onChange={(e) => setCourseNote(e.target.value)}
                      placeholder="Optional Focus Note (e.g. Kernels & Threads)"
                      className="flex-1 px-3 py-1.5 rounded bg-surface border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <label className="flex items-center space-x-1.5 font-mono text-[11px] text-muted cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={courseIsSecondary}
                        onChange={(e) => setCourseIsSecondary(e.target.checked)}
                        className="rounded text-accent focus:ring-accent"
                      />
                      <span>Secondary Elective</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Technologies Tag Field */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Technologies / Focus Areas (Comma Separated)
                </label>
                <input
                  type="text"
                  value={orbitalTechInput}
                  onChange={(e) => setOrbitalTechInput(e.target.value)}
                  placeholder="Python, Linux, FastAPI, Algorithms"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Save Milestone to In-Memory List */}
              <div className="flex justify-end pt-3 border-t border-border/40">
                <Button
                  type="submit"
                  variant="primary"
                  className="space-x-1.5 font-mono text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {editingOrbitalId
                      ? "Apply Edits to Sequence"
                      : "Add to Orbital Sequence"}
                  </span>
                </Button>
              </div>
            </form>

            {/* Live WYSIWYG Orbital Node Preview */}
            <div className="p-5 rounded-panel border border-sky-500/30 bg-surface shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-muted font-mono text-xs">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>{"// Live WYSIWYG Orbital Node Preview"}</span>
              </div>
              <div className="p-5 rounded-xl border border-border/60 bg-surface-elevated/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border text-accent font-semibold">
                    {orbitalPeriod || "2024"}
                  </span>
                  <span className="font-mono text-[10px] text-muted tracking-wider uppercase">
                    {orbitalStageBadge || "CORE CURRICULUM"}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground">
                  {orbitalTitle || "Milestone Title Preview"}
                </h4>
                <p className="text-muted text-xs leading-relaxed">
                  {orbitalDesc || "Summary description of engineering progression..."}
                </p>
                {orbitalCourses.length > 0 && (
                  <div className="pt-2 border-t border-border/40 space-y-1.5">
                    {orbitalCourses.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between font-mono text-[11px] text-muted"
                      >
                        <span>{c.name}</span>
                        <span className="font-semibold text-emerald-400">
                          {c.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {orbitalTechInput.trim() && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {orbitalTechInput.split(",").map((t) => (
                      <Badge key={t} variant="tech" tech={t.trim()} size="sm">
                        {t.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. DSA JOURNEY STEPPER SUB-EDITOR */}
      {/* ==================================================== */}
      {timelineMode === "dsa" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Steps List Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                DSA Steps Sequence ({dsaMilestones.length})
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetDsaForm}
                className="space-x-1 font-mono text-xs text-accent"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New DSA Step</span>
              </Button>
            </div>

            <div className="space-y-3">
              {dsaMilestones.map((item, idx) => {
                const isSelected = editingDsaId === item.id;
                const statusColor =
                  item.status === "Completed"
                    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    : item.status === "Current Milestone"
                    ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                    : "text-muted border-border bg-surface-elevated";

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "border-accent bg-accent/5 shadow-sm ring-1 ring-accent/30"
                        : "border-border bg-surface hover:border-border-hover"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-elevated border border-border text-foreground font-bold">
                            STEP {item.step}
                          </span>
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-medium ${statusColor}`}>
                            {item.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted line-clamp-2">
                          {item.description}
                        </p>
                        {item.complexity && (
                          <div className="font-mono text-[10px] text-muted/80 pt-0.5">
                            Complexity: {item.complexity}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveDsa(idx, "up")}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1 rounded text-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDsa(idx, "down")}
                            disabled={idx === dsaMilestones.length - 1}
                            title="Move Down"
                            className="p-1 rounded text-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => startEditDsa(item)}
                            title="Edit Step"
                            className="p-1 rounded text-muted hover:text-accent"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDsa(item.id)}
                            title="Delete Step"
                            className="p-1 rounded text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DSA Step Builder & Live Preview Column */}
          <div className="lg:col-span-7 space-y-6">
            <form
              onSubmit={handleSaveDsaMilestone}
              className="p-6 rounded-panel border border-border bg-surface/90 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center space-x-2 font-mono text-xs text-foreground font-semibold">
                  <Code2 className="w-4 h-4 text-accent" />
                  <span>
                    {editingDsaId
                      ? `Editing: ${dsaTitle || "DSA Step"}`
                      : "Create New DSA Milestone Step"}
                  </span>
                </div>
                {editingDsaId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetDsaForm}
                    className="font-mono text-xs text-muted"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Step Number <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={dsaStep}
                    onChange={(e) => setDsaStep(e.target.value)}
                    placeholder="e.g. 05 or 03"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Stage Badge
                  </label>
                  <input
                    type="text"
                    value={dsaBadge}
                    onChange={(e) => setDsaBadge(e.target.value)}
                    placeholder="e.g. NEXT HORIZON"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Progress Status
                  </label>
                  <select
                    value={dsaStatus}
                    onChange={(e) =>
                      setDsaStatus(
                        e.target.value as
                          | "Completed"
                          | "Current Milestone"
                          | "Next Target"
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Current Milestone">Current Milestone</option>
                    <option value="Next Target">Next Target</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Step Title <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={dsaTitle}
                  onChange={(e) => setDsaTitle(e.target.value)}
                  placeholder="e.g. Two Sum — The Canonical Problem (LeetCode #1)"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Technical Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={dsaDesc}
                  onChange={(e) => setDsaDesc(e.target.value)}
                  placeholder="Mechanics explored, algorithmic tradeoffs, data structures used, and key takeaways..."
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              </div>

              {/* Complexity Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                    Complexity Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"].map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDsaComplexity(`${preset} Time`)}
                          className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-muted hover:text-foreground"
                        >
                          {preset}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  value={dsaComplexity}
                  onChange={(e) => setDsaComplexity(e.target.value)}
                  placeholder="e.g. O(n) Time · O(n) Space"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Code Highlight Snippet */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Code Highlight Snippet (Optional)
                </label>
                <input
                  type="text"
                  value={dsaCodeHighlight}
                  onChange={(e) => setDsaCodeHighlight(e.target.value)}
                  placeholder="e.g. complement = target - num"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-cyan-300 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Topics Tags */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Topics / Patterns (Comma Separated)
                </label>
                <input
                  type="text"
                  value={dsaTopicsInput}
                  onChange={(e) => setDsaTopicsInput(e.target.value)}
                  placeholder="LeetCode #1, Single-Pass Hash Map, Complement Search"
                  className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Save Step Button */}
              <div className="flex justify-end pt-3 border-t border-border/40">
                <Button
                  type="submit"
                  variant="primary"
                  className="space-x-1.5 font-mono text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {editingDsaId
                      ? "Apply Edits to DSA Rail"
                      : "Add to DSA Stepper Rail"}
                  </span>
                </Button>
              </div>
            </form>

            {/* Live Stepper Node Preview */}
            <div className="p-5 rounded-panel border border-cyan-500/30 bg-surface shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-muted font-mono text-xs">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>{"// Live WYSIWYG DSA Stepper Node Preview"}</span>
              </div>
              <div className="p-5 rounded-xl border border-border/60 bg-surface-elevated/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border text-foreground font-bold">
                      STEP {dsaStep || "03"}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {dsaBadge || "MILESTONE ACHIEVED"}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-medium ${
                      dsaStatus === "Completed"
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        : dsaStatus === "Current Milestone"
                        ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                        : "text-muted border-border bg-surface-elevated"
                    }`}
                  >
                    {dsaStatus}
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {dsaTitle || "DSA Step Title Preview"}
                </h4>
                <p className="text-muted text-xs leading-relaxed">
                  {dsaDesc || "Technical overview of problem formulation and algorithmic strategy..."}
                </p>
                {dsaComplexity && (
                  <div className="font-mono text-[11px] text-muted bg-surface/70 border border-border/50 rounded px-2.5 py-1 inline-block">
                    Complexity: <strong className="text-foreground">{dsaComplexity}</strong>
                  </div>
                )}
                {dsaCodeHighlight && (
                  <div className="p-2.5 rounded bg-black/50 border border-border/60 font-mono text-xs text-cyan-300">
                    <code>{dsaCodeHighlight}</code>
                  </div>
                )}
                {dsaTopicsInput.trim() && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {dsaTopicsInput.split(",").map((t) => (
                      <Badge key={t} variant="tech" tech={t.trim()} size="sm">
                        {t.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

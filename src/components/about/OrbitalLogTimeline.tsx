"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { orbitalLogMilestones } from "@/data/timeline";
import { Badge } from "@/components/ui/Badge";
import { Compass, BookOpen, Terminal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrbitalLogTimeline() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const milestoneVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const lineVariants: Variants = {
    hidden: shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="orbital-log"
      aria-label="Orbital Log: Academic foundations to independent engineering timeline"
      className="space-y-8 pt-10 border-t border-border/40"
    >
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-border/40">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4 text-accent" />
          <span>Orbital Log // Trajectory Telemetry</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          ORBITAL LOG
        </h2>

        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          From academic foundations to independent engineering.
        </p>
      </div>

      {/* Interactive Timeline Container */}
      <div className="relative pl-7 sm:pl-10">
        {/* Thin Orbital Track Line */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          style={{ originY: 0 }}
          className="absolute left-[7px] sm:left-[9px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-accent/50 via-cyan-400/40 to-indigo-400/50 pointer-events-none"
        />

        {/* Milestone Sequence */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="space-y-10"
        >
          {orbitalLogMilestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              variants={milestoneVariants}
              className="relative group"
            >
              {/* Milestone Node on Orbital Track */}
              <div
                className="absolute -left-[27px] sm:-left-[39px] top-1.5 flex items-center justify-center"
                aria-hidden="true"
              >
                {milestone.isCurrent ? (
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-surface shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  </span>
                ) : milestone.isMajorMilestone ? (
                  <div className="w-4 h-4 rounded-full border-2 border-accent bg-surface-elevated flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-border/90 bg-surface-elevated group-hover:border-accent transition-colors" />
                )}
              </div>

              {/* Milestone Content Container */}
              <div
                className={cn(
                  "p-5 sm:p-6 rounded-panel border backdrop-blur-md transition-all space-y-3.5",
                  milestone.isCurrent
                    ? "bg-surface-elevated/90 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                    : "bg-surface/80 border-border hover:border-accent/40 shadow-sm"
                )}
              >
                {/* Milestone Epoch & Stage Badge */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span
                    className={cn(
                      "font-bold tracking-wider",
                      milestone.isCurrent ? "text-cyan-300" : "text-accent"
                    )}
                  >
                    {milestone.period}
                  </span>
                  <span className="text-muted/40" aria-hidden="true">
                    {"//"}
                  </span>
                  <span className="text-[11px] text-muted tracking-wider uppercase font-semibold">
                    {milestone.stageBadge}
                  </span>
                  {milestone.isCurrent && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Current Stage</span>
                    </span>
                  )}
                </div>

                {/* Milestone Title */}
                <h3
                  className={cn(
                    "text-lg sm:text-xl font-bold font-mono tracking-tight",
                    milestone.isCurrent
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-200 to-indigo-200"
                      : "text-foreground"
                  )}
                >
                  {milestone.title}
                </h3>

                {/* Milestone Description */}
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  {milestone.description}
                </p>

                {/* Coursework Rows (Compact Metadata Display) */}
                {milestone.courses && milestone.courses.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-mono text-muted uppercase tracking-wider flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-accent/80" />
                      <span>Computing Coursework</span>
                    </div>

                    <div className="space-y-1.5">
                      {milestone.courses.map((course) => (
                        <div
                          key={course.name}
                          className={cn(
                            "flex items-center justify-between py-2 px-3 rounded-lg border text-xs font-mono transition-colors",
                            course.isSecondary
                              ? "bg-surface/50 border-border/40 text-muted/90"
                              : "bg-surface-elevated/70 border-border/60 hover:border-accent/30"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2.5 min-w-0 pr-3">
                            <span className="text-[10px] text-muted/70 uppercase tracking-widest font-semibold shrink-0">
                              COURSE
                            </span>
                            <span className="font-sans font-medium text-foreground text-xs sm:text-sm truncate">
                              {course.name}
                            </span>
                            {course.note && (
                              <span className="text-[10px] text-muted/60 hidden md:inline font-mono">
                                ({course.note})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0 pl-2">
                            <span className="text-[10px] text-muted/70 uppercase tracking-widest">
                              GRADE
                            </span>
                            <span
                              className={cn(
                                "font-mono font-bold px-2 py-0.5 rounded text-xs",
                                course.grade === "O" || course.grade.startsWith("A+")
                                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                                  : "text-accent bg-accent/10 border border-accent/20"
                              )}
                            >
                              {course.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Independent Learning Technologies (Current Stage) */}
                {milestone.technologies && milestone.technologies.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Active Focus Vectors</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {milestone.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="tech"
                          tech={tech}
                          className="font-mono text-xs py-1 px-3 border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import * as React from "react";
import { Terminal, Cpu, Network, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface PhilosophyCardProps {
  title: string;
  description: string;
  icon: "Cpu" | "Terminal" | "Network" | "Layers";
  className?: string;
}

const ICONS = {
  Cpu,
  Terminal,
  Network,
  Layers,
};

export function PhilosophyCard({
  title,
  description,
  icon,
  className,
}: PhilosophyCardProps) {
  const IconComponent = ICONS[icon] || Terminal;

  const colorStyles = {
    Cpu: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    Terminal: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    Network: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/30",
    Layers: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
  }[icon] || "text-accent bg-accent/10 border-accent/30";

  return (
    <Card hoverEffect className={cn("flex flex-col justify-between hover:border-accent/50", className)}>
      <CardHeader>
        <div className="flex items-center space-x-2.5 pb-2">
          <div className={cn("p-1.5 rounded-md border", colorStyles)}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-medium">
            Principle
          </span>
        </div>
        <CardTitle as="h3" className="text-xl group-hover:text-accent transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted leading-relaxed mt-2">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

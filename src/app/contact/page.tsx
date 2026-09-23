import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { socialLinks } from "@/data/social";
import { profile } from "@/data/profile";
import {
  Terminal,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  MessageSquare,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Comms | Shishir Dev — Backend & Systems Developer",
  description:
    "Direct communications with Shishir Dev for backend infrastructure, Linux systems development, network protocols, or engineering collaboration.",
  openGraph: {
    title: "Comms Channel // Shishir Dev",
    description: "Connect with Shishir Dev for systems engineering, backend architecture, and technical collaborations.",
  },
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
      {/* Page Header */}
      <header className="pb-10 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-accent" />
          <span>Comms Channel // Engineering Collaboration</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          Open Communications
        </h1>

        <p className="text-muted text-lg max-w-3xl leading-relaxed">
          Open for backend engineering discussions, Linux systems programming, network internals, and robust software architecture collaborations.
        </p>

        <div className="flex flex-wrap gap-6 font-mono text-xs text-muted pt-2">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-accent" />
            <span>Station: <strong className="text-foreground">{profile.location}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-success animate-pulse" />
            <span>Telemetry: <strong className="text-foreground">Direct Frequency Active</strong></span>
          </div>
        </div>
      </header>

      {/* Main Grid: Form + Direct Frequencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left 2 Cols: Interactive Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-mono text-foreground flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>Direct Transmission</span>
            </h2>
            <p className="text-muted text-sm">
              Validated on client and server with genuine status handling.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Right 1 Col: Direct Channels */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-mono text-foreground">
              Direct Channels
            </h2>
            <p className="text-muted text-xs">
              Verified professional communication links:
            </p>
          </div>

          <div className="space-y-3">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target={link.platform === "Email" ? undefined : "_blank"}
                rel={link.platform === "Email" ? undefined : "noopener noreferrer"}
                className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border hover:border-accent/50 transition-all duration-200 group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-md bg-surface-elevated text-accent group-hover:scale-105 transition-transform">
                    {link.platform === "GitHub" && <Github className="w-4 h-4" />}
                    {link.platform === "LinkedIn" && <Linkedin className="w-4 h-4" />}
                    {link.platform === "Email" && <Mail className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                      {link.platform}
                    </h3>
                    <p className="text-[11px] text-muted">{link.label}</p>
                  </div>
                </div>

                <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>

          {/* Comms Protocol */}
          <div className="p-4 rounded-lg bg-surface-elevated/60 border border-border/60 font-mono text-xs text-muted space-y-2">
            <span className="text-accent uppercase font-semibold text-[11px]">
              TRANSMISSION PROTOCOL
            </span>
            <p className="text-[11px] leading-relaxed text-muted/90">
              Technical inquiries, systems architecture discussions, and open-source inquiries are reviewed promptly. Direct mail reaches primary station terminal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

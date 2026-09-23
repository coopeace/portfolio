"use client";

import * as React from "react";
import { contactFormSchema, type ContactFormData, type ContactApiResponse } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle2, AlertCircle, RefreshCw, Mail, ExternalLink } from "lucide-react";
import { playClickSound, playHoverSound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<ContactApiResponse | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playClickSound();
    setIsSubmitting(true);
    setResponse(null);

    // Client-side Zod validation
    const validation = contactFormSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data: ContactApiResponse = await res.json();
      setResponse(data);

      if (data.success) {
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      }
    } catch {
      setResponse({
        success: false,
        message: "Inquiry dispatch interrupted by network anomaly. Please try again or use direct mailto.",
        status: "VALIDATION_FAILED",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 rounded-panel border border-border bg-surface/90 backdrop-blur-md shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="block font-mono text-xs uppercase tracking-wider text-foreground font-semibold"
          >
            Name / Organization <span className="text-accent">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alex Rivera / Tech Core"
            disabled={isSubmitting}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-surface-elevated border font-mono text-sm text-foreground placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
              errors.name ? "border-red-500 focus:ring-red-500" : "border-border"
            )}
          />
          {errors.name && (
            <p className="font-mono text-xs text-red-500 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 inline" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="block font-mono text-xs uppercase tracking-wider text-foreground font-semibold"
          >
            Communication Frequency (Email) <span className="text-accent">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. alex@example.com"
            disabled={isSubmitting}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-surface-elevated border font-mono text-sm text-foreground placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
              errors.email ? "border-red-500 focus:ring-red-500" : "border-border"
            )}
          />
          {errors.email && (
            <p className="font-mono text-xs text-red-500 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 inline" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label
            htmlFor="contact-message"
            className="block font-mono text-xs uppercase tracking-wider text-foreground font-semibold"
          >
            Transmission Message &amp; Scope <span className="text-accent">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="State technical inquiry, backend architecture requirements, or collaboration scope..."
            disabled={isSubmitting}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-surface-elevated border font-mono text-sm text-foreground placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-accent resize-y",
              errors.message ? "border-red-500 focus:ring-red-500" : "border-border"
            )}
          />
          {errors.message && (
            <p className="font-mono text-xs text-red-500 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 inline" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            onMouseEnter={playHoverSound}
            className="w-full sm:w-auto space-x-2 font-mono text-xs"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Encoding &amp; Transmitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Transmit Message</span>
              </>
            )}
          </Button>
        </div>

        {/* Response / Feedback Box */}
        {response && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "p-4 rounded-lg border font-mono text-xs space-y-2",
              response.success
                ? "border-success/40 bg-success/10 text-foreground"
                : "border-red-500/40 bg-red-500/10 text-foreground"
            )}
          >
            <div className="flex items-center space-x-2 font-semibold">
              {response.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>TRANSMISSION RECEIVED SUCCESSFULLY</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>TRANSMISSION FAILED</span>
                </>
              )}
            </div>

            <p className="text-muted leading-relaxed">{response.message}</p>

            {response.fallbackUrl && (
              <div className="pt-2">
                <a
                  href={response.fallbackUrl}
                  className="inline-flex items-center space-x-1.5 text-accent hover:underline font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Prepared Message in Mail Client</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

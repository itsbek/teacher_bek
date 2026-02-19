"use client";

import React, { useMemo, useState } from "react";
import { useAudio } from "./audio-provider";
import { MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  forWhom: string;
  level: string;
  goal: string;
};

const INITIAL_FORM_STATE: FormState = {
  name: "",
  email: "",
  message: "",
  consent: false,
  forWhom: "",
  level: "",
  goal: "",
};

type SelectorGroupProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
};

function SelectorGroup({ label, options, value, onChange }: SelectorGroupProps) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 mb-3">
        {label}
      </p>
      {/* min-h prevents layout shift when option text length varies by locale */}
      <div className="flex flex-wrap gap-2 min-h-[2.75rem]">
        {options.map((opt) => (
          <span
            key={opt}
            role="button"
            tabIndex={0}
            onClick={() => onChange(opt)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(opt)}
            className={`
              px-4 py-2 text-sm font-mono tracking-wide cursor-pointer border transition-all duration-200 select-none whitespace-nowrap
              ${value === opt
                ? "bg-foreground text-background border-foreground"
                : "border-foreground/20 text-foreground/70 hover:border-foreground/60 hover:text-foreground"
              }
            `}
          >
            {opt}
          </span>
        ))}
      </div>
    </div>
  );
}

export function VanguardInquiry() {
  const { playSound } = useAudio();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [formStartedAt] = useState(() => Date.now());

  const canSubmit = useMemo(() => {
    return (
      formState.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email) &&
      formState.consent &&
      formState.forWhom !== "" &&
      formState.level !== "" &&
      formState.goal !== ""
    );
  }, [formState]);

  const handleFieldChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");
    playSound("click");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          message: formState.message.trim(),
          consent: formState.consent,
          forWhom: formState.forWhom,
          level: formState.level,
          goal: formState.goal,
          website: "",
          formStartedAt,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to send message.");

      setStatus("success");
      setStatusMessage(data?.message || "Message sent successfully.");
      setFormState(INITIAL_FORM_STATE);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background text-foreground px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-14 pb-6 border-b border-foreground/10">
          <div>
            <span className="text-[var(--text-xs)] font-mono opacity-80 block mb-2">Contact</span>
            <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-display tracking-tight leading-none mb-3">
              Get in Touch
            </h2>
            <p className="font-mono text-xs text-foreground/50">
              Tell us who you&apos;re booking for and we&apos;ll suggest the right program.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-80">
              Usually replies within 24 hours
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">

          {/* Form Column */}
          <div className="lg:col-span-7 editorial-panel p-6 md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 group/form">
              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {/* Segment A: Who */}
              <SelectorGroup
                label="Who is this for?"
                options={["My Child", "Myself"]}
                value={formState.forWhom}
                onChange={(val) => { handleFieldChange("forWhom", val); playSound("hover"); }}
              />

              {/* Segment B: Level */}
              <SelectorGroup
                label="Current level?"
                options={["Beginner", "Intermediate", "Advanced", "Not Sure"]}
                value={formState.level}
                onChange={(val) => { handleFieldChange("level", val); playSound("hover"); }}
              />

              {/* Segment C: Goal */}
              <SelectorGroup
                label="Main goal?"
                options={["IELTS Score", "Speaking Confidence", "School Grades", "Work English"]}
                value={formState.goal}
                onChange={(val) => { handleFieldChange("goal", val); playSound("hover"); }}
              />

              {/* Divider */}
              <div className="border-t border-foreground/10" />

              {/* Name */}
              <div className={`relative border-b transition-colors duration-500 ${focusedField === "name" ? "border-foreground" : "border-foreground/20 group-hover/form:border-foreground/40"}`}>
                <label htmlFor="vanguard-name" className="block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold mb-4 opacity-80">
                  Full Name
                </label>
                <input
                  id="vanguard-name"
                  type="text"
                  required
                  minLength={2}
                  value={formState.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onFocus={() => { setFocusedField("name"); playSound("hover"); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your full name"
                  className="w-full bg-transparent border-none py-4 font-display text-3xl md:text-5xl uppercase tracking-tighter outline-none placeholder:opacity-35"
                />
              </div>

              {/* Email */}
              <div className={`relative border-b transition-colors duration-500 ${focusedField === "email" ? "border-foreground" : "border-foreground/20 group-hover/form:border-foreground/40"}`}>
                <label htmlFor="vanguard-email" className="block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold mb-4 opacity-80">
                  Email
                </label>
                <input
                  id="vanguard-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onFocus={() => { setFocusedField("email"); playSound("hover"); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-none py-4 font-display text-3xl md:text-5xl uppercase tracking-tighter outline-none placeholder:opacity-35"
                />
              </div>

              {/* Optional message */}
              <div className={`relative border-b transition-colors duration-500 ${focusedField === "message" ? "border-foreground" : "border-foreground/20 group-hover/form:border-foreground/40"}`}>
                <label htmlFor="vanguard-message" className="block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold mb-4 opacity-80">
                  Anything else to add?{" "}
                  <span className="opacity-40 normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id="vanguard-message"
                  rows={3}
                  value={formState.message}
                  onChange={(e) => handleFieldChange("message", e.target.value)}
                  onFocus={() => { setFocusedField("message"); playSound("hover"); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Any extra context..."
                  className="w-full bg-transparent border-none py-4 font-display text-3xl md:text-5xl uppercase tracking-tighter outline-none placeholder:opacity-35 resize-none min-h-[110px]"
                />
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 text-[11px] uppercase tracking-[0.18em] font-bold opacity-90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.consent}
                  onChange={(e) => handleFieldChange("consent", e.target.checked)}
                  className="mt-1 size-4 rounded border border-foreground/30 bg-transparent"
                />
                <span>I consent to data processing for inquiry follow-up.</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                onMouseEnter={() => playSound("hover")}
                className="vanguard-magnetic group self-start flex flex-col gap-3 mt-2 disabled:opacity-40 disabled:cursor-not-allowed link-sheen"
              >
                <span className="text-[var(--text-xs)] uppercase tracking-[0.5em] font-bold flex items-center gap-4 group-hover:italic transition-all">
                  {isSubmitting ? "Sending..." : "Send Message"}{" "}
                  <Send size={14} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="w-40 h-[2px] bg-foreground/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                </div>
              </button>

              {/* Status feedback */}
              {status !== "idle" && (
                <div className={`flex items-center gap-3 text-sm ${status === "success" ? "text-green-500" : "text-red-500"}`}>
                  {status === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{statusMessage}</span>
                </div>
              )}
            </form>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-16">
            {/* Map */}
            <div className="relative w-full border border-foreground/20 overflow-hidden bg-foreground/5 editorial-panel" style={{ height: "320px" }}>
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-4 py-2 border border-foreground/10">
                <span className="text-[var(--text-xs)] font-bold tracking-widest uppercase flex items-center gap-2">
                  <MapPin size={12} /> Classroom: Golden Mansion, Phu Nhuan
                </span>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d974.7574530506484!2d106.66820746963197!3d10.803109899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b00e4da229%3A0x3aba4a5d0e7a050c!2sGolden%20Mansion!5e0!3m2!1sen!2svn!4v1740000000000!5m2!1sen!2svn"
                title="Classroom location — Golden Mansion, 119 Pho Quang, Phu Nhuan"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Hours + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="text-[var(--text-xs)] font-bold uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
                  <Clock size={12} /> Teaching Hours (GMT+7)
                </span>
                <div className="space-y-2 font-mono text-[var(--text-xs)] opacity-85">
                  <p className="flex justify-between border-b border-foreground/5 pb-2"><span>MON – THU</span><span>09:00 – 18:00</span></p>
                  <p className="flex justify-between border-b border-foreground/5 pb-2"><span>FRI</span><span>09:00 – 15:00</span></p>
                  <p className="flex justify-between"><span>SAT – SUN</span><span className="italic opacity-40">By appointment</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[var(--text-xs)] font-bold uppercase tracking-[0.2em] opacity-80">Address</span>
                <p className="font-mono text-[var(--text-xs)] leading-relaxed opacity-85">
                  Golden Mansion<br />
                  119 Pho Quang, Ward 9<br />
                  Phu Nhuan, HCMC<br />
                  Vietnam
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

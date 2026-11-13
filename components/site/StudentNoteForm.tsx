"use client";

import { useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

interface Strings {
  title: string;
  name: string;
  namePh: string;
  studied: string;
  studiedPh: string;
  optional: string;
  message: string;
  messagePh: string;
  wall: string;
  send: string;
  sending: string;
  sent: string;
  sentWall: string;
  error: string;
}

interface Props {
  locale: string;
  strings: Strings;
}

type State = "idle" | "sending" | "sent" | "error";

/** A note to the teacher. It reaches him on Telegram; with the box ticked he may put it on the wall. */
export function StudentNoteForm({ locale, strings: s }: Props) {
  const [state, setState] = useState<State>("idle");
  const [wall, setWall] = useState(false);
  const started = useRef<number>(0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(f.get("name") ?? ""),
          studied: String(f.get("studied") ?? "") || undefined,
          message: String(f.get("message") ?? ""),
          wall,
          locale,
          website: String(f.get("website") ?? ""),
          formStartedAt: started.current || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("not sent");
      setState("sent");
      track("student_note", { for_wall: wall ? "yes" : "no", site_language: locale });
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="s-card s-done" role="status">
        <p className="t-hand">{wall ? s.sentWall : s.sent}</p>
      </div>
    );
  }

  return (
    <form
      className="s-card"
      onSubmit={onSubmit}
      onFocus={() => {
        if (!started.current) started.current = Date.now();
      }}
    >
      <h2 className="s-title" id="s-write-h">
        {s.title}
      </h2>
      <label className="s-field">
        <span>{s.name}</span>
        <input name="name" required minLength={1} maxLength={60} autoComplete="given-name" placeholder={s.namePh} />
      </label>
      <label className="s-field">
        <span>
          {s.studied} <i>({s.optional})</i>
        </span>
        <input name="studied" maxLength={80} placeholder={s.studiedPh} />
      </label>
      <label className="s-field">
        <span>{s.message}</span>
        <textarea name="message" required minLength={2} maxLength={1200} rows={5} placeholder={s.messagePh} />
      </label>
      {/* honeypot: people never see it */}
      <input className="vh" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="s-check">
        <input type="checkbox" checked={wall} onChange={(e) => setWall(e.target.checked)} />
        <span>{s.wall}</span>
      </label>
      <button className="btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? s.sending : s.send}
      </button>
      {state === "error" && (
        <p className="s-err" role="alert">
          {s.error}
        </p>
      )}
    </form>
  );
}

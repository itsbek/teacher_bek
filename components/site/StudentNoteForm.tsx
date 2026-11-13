"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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
  /** "{hours}" is replaced with the hours left */
  cooldown: string;
  words: string;
}

interface Props {
  locale: string;
  strings: Strings;
}

type State = "idle" | "sending" | "sent" | "error" | "words" | "cooldown";

const DEV_KEY = "bek-dev";
const NEXT_KEY = "bek-note-next";
const store = {
  get: (k: string): string | null => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string): void => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode: the server still enforces the limit */
    }
  },
};

/** This browser's id: kept in storage as a fallback for the server's cookie. */
function deviceId(): string {
  let id = store.get(DEV_KEY);
  if (!id || !/^[a-f0-9-]{16,40}$/i.test(id)) {
    id = crypto.randomUUID();
    store.set(DEV_KEY, id);
  }
  return id;
}

/** Android Chrome can tell the phone model (e.g. "SM-A156E"); other browsers do not. */
async function phoneModel(): Promise<string | undefined> {
  const uad = (navigator as Navigator & { userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ model?: string }> } })
    .userAgentData;
  try {
    const v = await uad?.getHighEntropyValues?.(["model"]);
    return v?.model || undefined;
  } catch {
    return undefined;
  }
}

const hoursLeft = (iso: string | null): number => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? Math.max(0, Math.ceil((t - Date.now()) / 3600_000)) : 0;
};

/** A note to the teacher. It reaches him on Telegram; with the box ticked he may put it on the wall. */
export function StudentNoteForm({ locale, strings: s }: Props) {
  const [state, setState] = useState<State>("idle");
  const [wall, setWall] = useState(false);
  const started = useRef<number>(0);
  const [nextAt, setNextAt] = useState<string | null>(null);

  // a note was sent from this browser recently: say when the next one can go (the server has the final word)
  useEffect(() => {
    const n = store.get(NEXT_KEY);
    if (hoursLeft(n) > 0) {
      setNextAt(n);
      setState("cooldown");
    }
  }, []);

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
          deviceId: deviceId(),
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          lang: navigator.language,
          screen: `${screen.width}x${screen.height}@${devicePixelRatio}`,
          model: await phoneModel(),
          referrer: document.referrer || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; retryAt?: string; cooldownHours?: number };
      if (data.code === "WORDS") return setState("words");
      if (data.code === "COOLDOWN" && data.retryAt) {
        store.set(NEXT_KEY, data.retryAt);
        setNextAt(data.retryAt);
        return setState("cooldown");
      }
      if (!res.ok || !data.ok) throw new Error("not sent");
      if (data.cooldownHours) store.set(NEXT_KEY, new Date(Date.now() + data.cooldownHours * 3600_000).toISOString());
      setState("sent");
      track("student_note", { for_wall: wall ? "yes" : "no", site_language: locale });
    } catch {
      setState("error");
    }
  }

  if (state === "cooldown") {
    return (
      <div className="s-card s-done" role="status">
        <p className="t-hand">{s.cooldown.replace("{hours}", String(Math.max(1, hoursLeft(nextAt))))}</p>
      </div>
    );
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
      {(state === "error" || state === "words") && (
        <p className="s-err" role="alert">
          {state === "words" ? s.words : s.error}
        </p>
      )}
    </form>
  );
}

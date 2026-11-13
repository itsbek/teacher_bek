"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { getCore } from "@/lib/notebook/core";
import { ZALO_URL, errorKeyFor, postLead, useTurnstile, type ClientErrorCode } from "@/lib/leads/client";

/* "Your turn": a short chat that collects what Bek needs, then sends it to /api/contact.
   Port of docs/v4/proto2/js/talk.js. It renders into the same `.chat` / `.chat-in` markup the CSS styles,
   as two siblings inside the footer's #talk section. */

export interface ChatStrings {
  hi: string;
  who: [string, string];
  ageC: string;
  ageS: string;
  name: string;
  namePh: string;
  phone: string;
  phonePh: string;
  note: string;
  notePh: string;
  skip: string;
  next: string;
  consent: string;
  send: string;
  /** with {name} */
  done: string;
  zalo: string;
  copy: string;
  copied: string;
  /** with {name} {age} */
  msgChild: string;
  msgSelf: string;
  yrs: string;
  bad: string;
  badName: string;
  failZalo: string;
  /** shown when the anti-spam check could not load */
  captchaZalo: string;
  /** the `leads` namespace error messages, by errorKeyFor() key */
  errors: Record<string, string>;
}

interface ChatProps {
  locale: string;
  strings: ChatStrings;
}

interface Bubble {
  id: number;
  who: "bek" | "me";
  text: string;
  typing: boolean;
}

type Pending =
  | { kind: "chips"; opts: string[]; cls: string; resolve: (i: number) => void }
  | { kind: "field"; type: "text" | "tel"; ph: string; optional: boolean; resolve: (v: string) => void }
  | { kind: "summary" }
  | { kind: "after" }
  | null;

interface Collected {
  who: 0 | 1;
  age: number;
  name: string;
  phone: string;
  note: string;
}

const SEND_FLIGHT_MS = 1100;
const TYPING_MS = 650;

function BubbleView({ b }: { b: Bubble }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const cls = `bb ${b.who}${shown ? " in" : ""}${b.who === "bek" && !b.typing ? " said" : ""}`;
  return (
    <p className={cls}>
      {b.typing ? (
        <span className="typing">
          <i />
          <i />
          <i />
        </span>
      ) : (
        b.text
      )}
    </p>
  );
}

function Field({
  type,
  ph,
  optional,
  S,
  onDone,
}: {
  type: "text" | "tel";
  ph: string;
  optional: boolean;
  S: ChatStrings;
  onDone: (v: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    const id = setTimeout(() => input.current?.focus({ preventScroll: true }), 50);
    return () => clearTimeout(id);
  }, []);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = (input.current?.value ?? "").trim();
    if (!v && !optional) {
      input.current?.focus();
      return;
    }
    if (type === "tel" && v.replace(/\D/g, "").length < 9) {
      setErr(S.bad);
      return;
    }
    if (type === "text" && !optional && v.length < 2) {
      setErr(S.badName);
      return;
    }
    onDone(v);
  };
  return (
    <>
      <form className="fld" onSubmit={submit}>
        <input
          ref={input}
          className="inp"
          type={type}
          placeholder={ph}
          inputMode={type === "tel" ? "tel" : undefined}
          autoComplete={type === "tel" ? "tel" : "name"}
          aria-label={ph}
          maxLength={type === "tel" ? 30 : 100}
          required={!optional}
        />
        <button className="go mag" data-cur="send">
          {S.next} →
        </button>
        {optional && (
          <button type="button" className="skp" onClick={() => onDone("")}>
            {S.skip}
          </button>
        )}
      </form>
      <p className="err" aria-live="polite">
        {err}
      </p>
    </>
  );
}

export function Chat({ locale, strings: S }: ChatProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [pending, setPending] = useState<Pending>(null);
  const [consent, setConsent] = useState(false);
  const [flying, setFlying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const data = useRef<Collected>({ who: 0, age: 0, name: "", phone: "", note: "" });
  const startedAt = useRef(0);
  const started = useRef(false);
  const alive = useRef(false);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const ts = useTurnstile(active);

  const wait = (ms: number) =>
    new Promise<void>((res) => {
      const id = setTimeout(() => {
        timers.current.delete(id);
        res();
      }, ms);
      timers.current.add(id);
    });

  const scrollIn = () => {
    requestAnimationFrame(() => {
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      if (r.bottom > innerHeight - 20) {
        const y = r.bottom - innerHeight + 60;
        const core = getCore();
        if (core) core.scrollToY(core.sy() + y, 0.8);
        else scrollBy(0, y);
      }
    });
  };

  const push = (who: "bek" | "me", text: string, typing = false): number => {
    const id = nextId.current++;
    setBubbles((l) => [...l, { id, who, text, typing }]);
    return id;
  };
  const bek = async (text: string): Promise<void> => {
    const id = push("bek", "", true);
    await wait(TYPING_MS);
    if (!alive.current) return;
    setBubbles((l) => l.map((b) => (b.id === id ? { ...b, text, typing: false } : b)));
    scrollIn();
  };
  const chips = (opts: string[], cls = ""): Promise<number> =>
    new Promise((resolve) => {
      setPending({
        kind: "chips",
        opts,
        cls,
        resolve: (i) => {
          setPending(null);
          push("me", opts[i]);
          resolve(i);
        },
      });
    });
  const field = (type: "text" | "tel", ph: string, optional = false): Promise<string> =>
    new Promise((resolve) => {
      setPending({
        kind: "field",
        type,
        ph,
        optional,
        resolve: (v) => {
          setPending(null);
          if (v) push("me", v);
          resolve(v);
        },
      });
    });

  const compose = (): string => {
    const d = data.current;
    const base = (d.who === 0 ? S.msgChild : S.msgSelf).replace("{name}", d.name).replace("{age}", String(d.age));
    return base + (d.note ? " " + d.note : "");
  };

  const run = async (): Promise<void> => {
    startedAt.current = Date.now();
    const d = data.current;
    await bek(S.hi);
    if (!alive.current) return;
    d.who = (await chips(S.who)) === 0 ? 0 : 1;
    await bek(d.who === 0 ? S.ageC : S.ageS);
    if (!alive.current) return;
    const ages: string[] = [];
    for (let a = 5; a <= 17; a++) ages.push(a + S.yrs);
    d.age = (await chips(ages, "ages")) + 5;
    await bek(S.name);
    if (!alive.current) return;
    d.name = await field("text", S.namePh);
    await bek(S.phone);
    if (!alive.current) return;
    d.phone = await field("tel", S.phonePh);
    await bek(S.note);
    if (!alive.current) return;
    d.note = await field("text", S.notePh, true);
    setActive(true);
    setPending({ kind: "summary" });
    scrollIn();
  };

  useEffect(() => {
    alive.current = true;
    const t = timers.current;
    const host = chatRef.current?.parentElement;
    let io: IntersectionObserver | null = null;
    if (host) {
      io = new IntersectionObserver(
        (es) => {
          if (started.current || !es.some((e) => e.isIntersecting)) return;
          started.current = true;
          io?.disconnect();
          void run();
        },
        { threshold: 0.3 },
      );
      io.observe(host);
    }
    return () => {
      alive.current = false;
      io?.disconnect();
      t.forEach(clearTimeout);
      t.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (): Promise<void> => {
    if (!consent || flying) return;
    if (ts.enabled && !ts.token) return;
    const d = data.current;
    setFlying(true);
    setFailed(false);
    const [res] = await Promise.all([
      postLead("/api/contact", {
        name: d.name,
        phone: d.phone,
        message: compose(),
        forWhom: d.who === 0 ? "child" : "self",
        level: String(d.age),
        consent: true,
        consentText: S.consent,
        locale,
        website: honeypot.current?.value ?? "",
        formStartedAt: startedAt.current,
        ...(ts.enabled ? { turnstileToken: ts.token } : {}),
      }),
      wait(SEND_FLIGHT_MS),
    ]);
    if (!alive.current) return;
    setFlying(false);
    if (res.ok) {
      track("generate_lead", { lead_source: "chat", site_language: locale });
      setPending(null);
      await bek(S.done.replace("{name}", d.name));
      if (!alive.current) return;
      setPending({ kind: "after" });
      scrollIn();
      return;
    }
    const code: ClientErrorCode = res.code;
    track("lead_error", { error_code: code });
    ts.reset();
    setFailed(true);
    await bek(S.errors[errorKeyFor(code)] ?? S.errors.errorNetwork);
    scrollIn();
  };

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard?.writeText(compose());
    } catch {
      /* clipboard unavailable: the message is still in the Zalo flow */
    }
    setCopied(true);
  };

  const zaloRow = (
    <div className="after-send">
      <a className="cta mag" href={ZALO_URL} target="_blank" rel="noopener noreferrer" data-cur="say hi">
        {S.zalo}
      </a>
      <button type="button" className="cta2 mag" onClick={() => void copy()} data-cur="copy">
        {copied ? S.copied : S.copy}
      </button>
    </div>
  );

  return (
    <>
      <div className="chat" id="chat" ref={chatRef} aria-live="polite">
        {bubbles.map((b) => (
          <BubbleView key={b.id} b={b} />
        ))}
      </div>
      <div className="chat-in" id="chatIn" ref={boxRef}>
        {pending?.kind === "chips" && (
          <div className={`chips ${pending.cls}`}>
            {pending.opts.map((o, i) => (
              <button key={i} type="button" className="chip-o mag" data-cur="pick" onClick={() => pending.resolve(i)}>
                {o}
              </button>
            ))}
          </div>
        )}
        {pending?.kind === "field" && (
          <Field key={pending.ph} type={pending.type} ph={pending.ph} optional={pending.optional} S={S} onDone={pending.resolve} />
        )}
        {pending?.kind === "summary" && (
          <div className="sum">
            <label className="cons">
              <input type="checkbox" id="cons" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> <span>{S.consent}</span>
            </label>
            {/* honeypot: real visitors never see or fill this */}
            <input
              ref={honeypot}
              className="vh"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              defaultValue=""
            />
            {ts.enabled && <div ref={ts.containerRef} />}
            <button
              type="button"
              className={`send mag${flying ? " flying" : ""}`}
              id="send"
              disabled={!consent || flying || (ts.enabled && !ts.token)}
              data-cur="send"
              onClick={() => void send()}
            >
              <span>{S.send}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12 22 3l-6 19-4-8z" />
              </svg>
            </button>
            {(failed || ts.unavailable) && zaloRow}
            {ts.unavailable && <p className="err">{S.captchaZalo}</p>}
            {failed && !ts.unavailable && <p className="err">{S.failZalo}</p>}
          </div>
        )}
        {pending?.kind === "after" && zaloRow}
      </div>
    </>
  );
}

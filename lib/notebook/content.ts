/* The student's English notebook. Everything here is English-lesson content written or said by the
   student (or the English task itself), so it is identical in both locales and deliberately NOT in
   messages/*.json. Page copy around it lives in the `story` namespace. */

export const NOTEBOOK = {
  /** rows of tables the six-year-old copies into the notebook (wall scene) */
  rows: [
    "I am · you are · he is · she is",
    "we are · they are · it is",
    "go — went — gone",
    "see — saw — seen",
    "take — took — taken",
    "write — wrote — written",
    "a / an + singular noun",
    "the + specific noun",
    "much + uncountable",
    "many + countable",
    "few · a few · little · a little",
    "since + point in time",
    "for + period of time",
    "have + past participle",
    "will · shall · would · should",
    "in · on · at (time)",
    "in · on · at (place)",
    "if + past, would + verb",
    "its ≠ it’s",
    "their · there · they’re",
    "whom · whose · which",
    "make · do (!!)",
    "bring — brought — brought",
    "think — thought — thought",
    "teach — taught — taught",
    "buy — bought — bought",
  ],
  /** the hesitation, typed out in real time */
  fillers: ["My dog is…", "ờ…", "my dog… nó… big… big?", "ủa, tiếng Anh nói sao ta…", "cái con… gì á…", "hổng biết nữa thầy ơi"],
  /** words floating around the silence */
  ghosts: [
    "ủa…",
    "ờ ờ",
    "gì á…",
    "cái đó đó",
    "hông nhớ",
    "quên mất tiêu",
    "nó… nó…",
    "là… là…",
    "thầy ơi",
    "kiểu…",
    "hổng biết",
    "dog… dog…",
    "big… big?",
    "nói sao ta",
    "à…",
    "ừa",
  ],
  hesAsk: "“Okay. Tell me one sentence about your dog.”",
  /** handwritten page headings: [text, hand, jitter] — the hand grows up with the student */
  heads: {
    wall: ["learn by friday!", "print", 0.9],
    test: ["My week", "print", 0.6],
    turn: ["a / an / the", "casual", 0.45],
    wrong: ["Past simple", "casual", 0.35],
    six: ["My room", "casual", 0.25],
    dist: ["Present perfect", "cursive", 0.2],
    own: ["Free writing", "cursive", 0.12],
  },
  question: "Tell me about your week.",
  /** a Vietnamese nine-year-old's week, as they say it in an English speaking test: school, extra classes,
      the after-school activities parents book, food, family, phone, tests, and the sleep that is left over.
      Each one is a sticky note tossed onto the study desk. */
  week: [
    "School at 7.",
    "Extra maths.",
    "Homework.",
    "Piano.",
    "Swimming.",
    "Badminton.",
    "Bánh mì.",
    "Milk tea.",
    "Phone games.",
    "Grandma's on Sunday.",
    "Maths test Friday.",
    "Sleep, I think.",
  ],
  rule: { before: "Use ", a: "a", mid: " before singular countable nouns. Use ", the: "the", after: " for specific nouns." },
  knob: "why?",
  dog: { a: "a dog", the: "the dog", aria: "dog" },
  sentence: { before: "Yesterday I ", after: " to school." },
  options: ["goed", "went", "wented"],
  task: "Describe your room.",
  lies: ["My bed is blue.", "I have a cat.", "I sleep on the ceiling.", "My window faces east."],
  /** index of the lie in `lies` */
  lie: 2,
  /** what the student who has to win says in ten seconds */
  spoken: "My room is small but it has a big window, a blue bed and too many books.",
  keys: { a: "I lost my key.", bBefore: "I", bHave: "’ve", bAfter: " lost my key." },
  /** the age-17 sentence, written in one pen line */
  own: { a: "Honestly? It was ", u1: "a lot", b: ". But ", u2: "I’ve started", c: " climbing. I’m terrible at it, and I love it." },
} as const;

export type HeadId = keyof typeof NOTEBOOK.heads;

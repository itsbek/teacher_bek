# Copy deck — teacherbek.com revamp ("The Red Pen") · VI master + EN

Phase 1, steps P1.2. Draft v1, 2026-10-21. Vietnamese is the master; English follows it (not the other way round). ZH/RU are out of scope here (P1.9 translates the signed-off VI/EN deck; launch locales depend on Q10).

## 0. Rules this deck follows

**Voice (VI).** Warm, plain, confident, like a teacher talking to a parent at the classroom door. The teacher speaks as **thầy** ("thầy sửa lỗi", "thầy nhắn lại"); parents are **ba mẹ**; young child is **bé**, teen is **con**, adult is **bạn**. No jargon: the old phrases "acquisition through structured play", "examiner-criteria strategy", "deliberate practice" are not used. No "unlock", no lock icons, no "free" without saying what is free. [OWNER: confirm the teacher is addressed as "thầy Bek" and speaks as "thầy" (P8)]

**Voice (EN).** Same warmth, short sentences. The teacher speaks as "I" in first person on About/Final; elsewhere neutral ("Teacher Bek corrects kindly").

**Facts.** Only facts that exist in `messages/vi.json` / `messages/en.json` or REVAMP_PLAN.md are used. Every fact that needs the owner is tagged.
- `[CONFIRM Q#]` = number in the plan's "Questions for owner" table.
- `[OWNER: …]` = unknown or missing; owner must supply. A trailing `(P#)` points to a **proposed new question** listed in `open-questions.md` (the plan's table has no row for it).

**Formatting.** Numbers: VI `1.990.000 ₫`, EN `1,990,000 VND`. En dash in ranges: `6–10`. Time: `19:30–21:00`. Max length = characters including spaces; for headings the number is the **mobile display budget** (about 7 Vietnamese words or fewer, each line ≤ 14 characters, so a heading wraps to 2–3 lines at `display-l`). Labels in VI/ZH/RU are sentence case, never uppercase, never tracked.

**Handwritten layer (Q9).** Strings marked **(H)** are written by the owner's red pen. They are English words, numbers or symbols only (see `mistake-library.md` note 2). Vietnamese is always typeset in Inter/Playfair.

**Existing wording reused.** Where an existing sentence is kept it is marked `existing`. Existing claims still carry a CONFIRM tag if the plan lists them as unproven.

**Known conflicts in the current site (resolve before launch).**
1. Trial: "free week" (EN) vs "first month" (FAQ q3) vs "Buổi học 30 phút" (VI `cta.checklist_1`, a 30-minute session) → Q2.
2. Students taught: "2,000+" (EN) vs "Gần 2.000" (VI footer) → Q4. This deck does not use the number.
3. Reply time: "within 24 hours" (EN/VI form) vs "same-day / within a few hours" (EN/VI trust badge) → Q6.
4. Materials: EN "Fully Equipped" vs VI "Tất cả tài liệu được cung cấp" (all materials provided) → Q1 (what the fee includes).
5. Evening hours 19:30–21:00 on weekdays are late for ages 6–10 → Q3.
6. WhatsApp appears in contact copy; not used here unless Q15 = yes.

---

## 1. Home page `/vi/` · `/en/`

### 1.0 Page metadata

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.META.TITLE` | Tiếng Anh nhóm nhỏ ở Phú Nhuận \| Teacher Bek | Small-Group English in Phú Nhuận \| Teacher Bek | 60 incl. suffix | |
| `HOME.META.DESC` | Lớp tiếng Anh nhóm nhỏ tối đa 10 bạn: bé 6–10 tuổi, thiếu niên 11–17, IELTS và tiếng Anh công sở. Thầy Bek dạy tại Phổ Quang, Phú Nhuận. | Small-group English classes, max 10 students: kids 6–10, teens 11–17, IELTS and English for Work. Teacher Bek teaches on Phổ Quang, Phú Nhuận. | 155 | Address area [CONFIRM Q11]; "max 10" [CONFIRM Q3] |
| `HOME.META.H1` | Tiếng Anh nhóm nhỏ ở Phú Nhuận | Small-group English in Phú Nhuận | 7 words VI | SEO H1; the only `<h1>` on the page |
| `HOME.META.OG` | OG image text (typeset on paper): the corrected sentence "I really like English." + "Teacher Bek · Phú Nhuận" | same | — | one OG image per locale |

### 1.1 Section 1 — Hero: The Correction

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.HERO.EYEBROW` | Phú Nhuận · TP.HCM | Phú Nhuận · Ho Chi Minh City | 30 | |
| `HOME.HERO.SENT_WRONG` | I very like English. | I very like English. | 28 | Sentence stays English in every locale; it is the lesson. From `MIS.K01` |
| `HOME.HERO.SENT_RIGHT` | I really like English. | I really like English. | 28 | After correction; same DOM text exposed to screen readers |
| `HOME.HERO.PEN_NOTE` | Good! ✓ **(H)** | Good! ✓ **(H)** | handwritten | Q9 asset; the same note for all locales |
| `HOME.HERO.WHY` | Người Việt hay nói "rất thích" nên đặt "very" trước "like". Thầy sửa nhẹ nhàng, bé nói lại, và nhớ. | Vietnamese speakers say "rất thích", so "very" lands before "like". Teacher Bek fixes it kindly; the child says it again and remembers. | 120 | Template: a VI note from `mistake-library.md` + "Thầy sửa nhẹ nhàng…". Rotates with the sentence |
| `HOME.HERO.TAP_HINT` | Chạm để xem lỗi khác | Tap for another mistake | 26 | Desktop: "Bấm để xem lỗi khác" / "Click for another mistake". Plus the handwritten "tap me" **(H)** |
| `HOME.HERO.H1_SUB` | Mỗi buổi, bé nào cũng được nói. Thầy Bek sửa lỗi nhẹ nhàng ngay lúc bé nói. | Every lesson, every child speaks. Teacher Bek corrects kindly, right as they say it. | 90 | Facts: speak every session; direct feedback (existing, `about.philosophy`, `methodology`) |
| `HOME.HERO.AGES` | Bé 6–10 tuổi · Thiếu niên 11–17 · IELTS · Tiếng Anh công sở | Kids 6–10 · Teens 11–17 · IELTS · English for Work | 70 | One line; chips on desktop |
| `HOME.HERO.PROOF` | Tối đa 10 bạn/lớp · TESOL & PGCE · Dạy ở TP.HCM từ 2023 | Max 10 per class · TESOL & PGCE · Teaching in HCMC since 2023 | 70 | TESOL/PGCE [CONFIRM Q4]; max 10 [CONFIRM Q3]; "since 2023" from timeline `2023 — PRESENT` and VI footer "Giảng dạy từ năm 2023" |
| `HOME.HERO.PRICE_CUE` | Học phí từ 1.990.000 ₫/tháng | Fees from 1,990,000 VND/month | 40 | OPTIONAL. Show only if a public "from" price is approved. [CONFIRM Q1] |
| `HOME.HERO.CTA_PRIMARY` | Giữ chỗ | Hold a seat | 12 | Red-pen fill. Opens FORM step 1 (pre-selected by context) |
| `HOME.HERO.CTA_ZALO` | Nhắn Zalo | Message on Zalo | 14 | Secondary, text link style |
| `HOME.HERO.PHOTO_ALT` | Thầy Bek, giáo viên tiếng Anh, đang cười và lắng nghe một bạn nhỏ trong lớp | Teacher Bek smiling as he listens to a student in class | 120 | Photo #2 cut-out [OWNER: shoot not done (Q8)] |
| `HOME.HERO.SIGN` | Bek **(H)** | Bek **(H)** | handwritten | Signature, [OWNER: sample (Q9)] |

### 1.2 Section 2 — The problem

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.PROBLEM.H2` | Học nhiều năm, con vẫn ngại nói | Years of English class. Still won't speak up. | 32 VI (7 words) | |
| `HOME.PROBLEM.B1` | Con làm bài ngữ pháp giỏi, nhưng gặp người nước ngoài là im lặng. | Great at grammar worksheets, silent when a foreigner says hello. | 75 | Paraphrases testimonial "Linh N." (existing) [CONFIRM Q7] |
| `HOME.PROBLEM.B2` | Lớp 25 bạn, mỗi bé chỉ nói được khoảng 3 phút một buổi. | In a class of 25, each child speaks about 3 minutes a lesson. | 75 | Existing claim (`about.classroom.description`). [OWNER: confirm the arithmetic you stand behind (P2)] |
| `HOME.PROBLEM.B3` | Con dịch trong đầu rồi mới nói, nên trả lời chậm và hay bỏ dở. | Your child translates in their head first, so answers come slowly or not at all. | 80 | Paraphrases testimonial "Minh T." (existing) [CONFIRM Q7] |
| `HOME.PROBLEM.CLOSE` | Không phải con lười. Con chỉ chưa có chỗ để nói. | It isn't laziness. There just hasn't been room to speak. | 60 | Voice line; no factual claim |
| `HOME.PROBLEM.MARKS` | ✗ ✗ ✗ **(H)** | ✗ ✗ ✗ **(H)** | handwritten | Next to each bullet |

### 1.3 Section 3 — The method (chalk-green chapter)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.METHOD.H2` | Một buổi học diễn ra thế nào? | What happens in a lesson? | 30 (6 words) | |
| `HOME.METHOD.S1.TITLE` | Nói trước | Speak first | 14 | |
| `HOME.METHOD.S1.BODY` | Bé mở miệng ngay từ những phút đầu, không ngồi nghe giảng. Nói sai cũng được. | Your child speaks in the first minutes, not sits and listens. Mistakes are welcome. | 90 | Based on "speaking from session one" (existing) |
| `HOME.METHOD.S1.EX` | Ví dụ: "What did you eat today?" Bé trả lời bằng cả câu. | Example: "What did you eat today?" The answer is a full sentence. | 70 | Illustrative |
| `HOME.METHOD.S2.TITLE` | Luyện theo cặp | Practise in pairs | 18 | |
| `HOME.METHOD.S2.BODY` | Bé nói với bạn cùng lớp, nên bé nào cũng có lượt nói. | Children talk to each other, so everyone gets a turn. | 70 | [OWNER: confirm pair work is how lessons run (P1)] |
| `HOME.METHOD.S2.EX` | Ví dụ: hai bạn hỏi nhau về món ăn yêu thích. | Example: two children ask each other about favourite food. | 70 | [OWNER: real example from your lessons (P1)] |
| `HOME.METHOD.S3.TITLE` | Sửa lỗi nhẹ nhàng | Correct kindly | 20 | |
| `HOME.METHOD.S3.BODY` | Thầy sửa ngay lúc bé nói, rồi bé nói lại cho đúng. | I fix it as the child says it, then they say it again, correctly. | 70 | Based on "You speak. You get direct feedback. You speak again." (existing) |
| `HOME.METHOD.S3.EX` | Ví dụ: "She have a cat." → "She has a cat." | Example: "She have a cat." → "She has a cat." | 50 | From `MIS.K02`; correction drawn in red pen |
| `HOME.METHOD.S4.TITLE` | Báo cáo cho ba mẹ | Tell the parents | 20 | |
| `HOME.METHOD.S4.BODY` | Ba mẹ biết con đang tiến bộ ở đâu và cần luyện thêm gì. | Parents know where their child is improving and what to practise next. | 80 | [OWNER: do you report to parents, how, how often? (P1)] |
| `HOME.METHOD.S4.EX` | Ví dụ: một tin nhắn Zalo ngắn sau buổi học. | Example: a short Zalo message after the lesson. | 60 | [OWNER: real format (P1)] |
| `HOME.METHOD.VIDEO_CARD` | Xem một buổi học (20 giây) | Watch a lesson (20 seconds) | 30 | Video B [OWNER: shoot + consents (Q8)] |
| `HOME.METHOD.VIDEO_ALT` | Cảnh lớp học thật: các bạn nhỏ đang trò chuyện theo cặp, không thấy mặt | Real lesson: children talking in pairs, faces not shown | 120 | Only if no consent for faces (Q8) |

### 1.4 Section 4 — Level Ladder (programme explorer)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.LADDER.H2` | Bé nhà mình mấy tuổi? | How old is your learner? | 24 (5 words) | Slider label. Adults use the "Người lớn" stop |
| `HOME.LADDER.STOP1` | 6–10 tuổi | Ages 6–10 | 12 | |
| `HOME.LADDER.STOP2` | 11–17 tuổi | Ages 11–17 | 12 | |
| `HOME.LADDER.STOP3` | Người lớn | Adults | 12 | Sub-chips: "IELTS" / "Công sở" (English for Work) |
| `HOME.LADDER.SLIDER_A11Y` | Kéo để chọn độ tuổi. Hiện {n} chương trình. | Drag to choose an age. Showing {n} programme. | 60 | `aria-valuetext`; keyboard arrows move between stops |
| `HOME.LADDER.F_WHO` | Dành cho | Who it's for | 14 | Field labels, 13 px sentence case |
| `HOME.LADDER.F_SAMPLE` | Một lỗi thầy thường sửa | A mistake I often fix | 30 | Honest wording: a typical example, **not** a promised result. [OWNER: the plan wants a "before / after 3 months" sentence. That is a result claim; use real, consented student samples or keep this label (Q7)] |
| `HOME.LADDER.F_LESSON` | Mỗi buổi | Each lesson | 12 | |
| `HOME.LADDER.F_WHEN` | Lịch học | Schedule | 12 | |
| `HOME.LADDER.F_SIZE` | Số bạn trong lớp | Class size | 20 | |
| `HOME.LADDER.F_FEE` | Học phí | Fees | 10 | |
| `HOME.LADDER.CARD_CTA` | Giữ chỗ cho nhóm này | Hold a seat in this group | 28 | Opens form with group pre-filled |
| `HOME.LADDER.CARD_LINK` | Xem chi tiết chương trình | See the full programme | 30 | |
| `HOME.LADDER.SIZE_VAL` | Tối đa 10 bạn | Max 10 students | 16 | [CONFIRM Q3] |

Card contents per stop (values come from the programme pages in section 2):

| Stop | Name VI | Name EN | Lesson | Fee | Sample correction | Flags |
|---|---|---|---|---|---|---|
| 6–10 | Bé 6–10 tuổi | Young Learners | 2 buổi/tuần · 90 phút + 15 phút nghỉ | từ 1.990.000 ₫/tháng | "She have a cat." → "She has a cat." | Fee [CONFIRM Q1]; times [CONFIRM Q3] |
| 11–17 | Thiếu niên 11–17 | Teens | 2 buổi/tuần · 90 phút + 15 phút nghỉ | từ 1.990.000 ₫/tháng | "I am agree with you." → "I agree with you." | Fee [CONFIRM Q1] |
| Adult · IELTS | Luyện thi IELTS | IELTS Preparation | 2 buổi/tuần · 60 phút | từ 1.990.000 ₫/tháng | "Technology make life easier." → "Technology makes life easier." | Fee [CONFIRM Q1] |
| Adult · Work | Tiếng Anh công sở | English for Work | 2 buổi/tuần · 90 phút + 15 phút nghỉ | 3.000.000 ₫/tháng | "I am graduated in 2020." → "I graduated in 2020." | Fee [CONFIRM Q1] |

### 1.5 Section 5 — Margin notes (proof)

Quotes below are the **existing** site testimonials, unchanged. They may only be published if real and consented [CONFIRM Q7]. Margin note = one typeset line + handwritten ✓ **(H)**. No star ratings are shown (plan: no self-serving AggregateRating).

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.PROOF.H2` | Học viên và ba mẹ nói gì | What students and parents say | 28 | |
| `HOME.PROOF.T1.QUOTE` | Con gái tôi trước đây cứ gặp người nước ngoài nói chuyện là ngại không dám trả lời. Sau vài tháng học nhóm nhỏ, bé trả lời tự nhiên không còn ngập ngừng. Lớp ít học viên chính là điểm khác biệt — bé thực sự được nói. | My daughter used to freeze up when a foreigner spoke to her. After a few months of small-group classes, she answers back without thinking twice. The class size is what makes the difference — she actually gets to speak. | 260 | existing; [CONFIRM Q7] |
| `HOME.PROOF.T1.BY` | Linh N. · Phụ huynh bé 8 tuổi, Phú Nhuận | Linh N. · Parent of an 8-year-old, Phú Nhuận | 50 | Full first name [OWNER: Q7] |
| `HOME.PROOF.T1.NOTE` | Bé 8 tuổi · học nhóm nhỏ vài tháng ✓ | 8 years old · a few months in a small group ✓ | 45 | Margin note; ✓ **(H)** |
| `HOME.PROOF.T2.QUOTE` | Con trai tôi cần bỏ thói quen dịch trong đầu trước khi nói. Thầy Bek nói thẳng vấn đề thật sự đang cản trở con, và sự tự tin của con khi thuyết trình trên lớp đã thay đổi hoàn toàn. | My son needed to stop translating in his head before he could speak. Teacher Bek was direct about what was actually holding him back, and his confidence in class presentations has completely changed. | 230 | existing; [CONFIRM Q7] |
| `HOME.PROOF.T2.BY` | Minh T. · Phụ huynh bé 14 tuổi, Bình Thạnh | Minh T. · Parent of a 14-year-old, Bình Thạnh | 50 | |
| `HOME.PROOF.T2.NOTE` | Con 14 tuổi · tự tin thuyết trình trên lớp ✓ | 14 years old · confident in class presentations ✓ | 50 | |
| `HOME.PROOF.T3.QUOTE` | Chỉ một tuần học thử miễn phí là đủ để thấy khác biệt so với lớp cũ 25 học viên. Ở đây bé là một trong tám bạn, và bé thực sự háo hức muốn đi học. | One free trial week was enough to see the difference from her previous class of 25 students. Here she's one of eight, and she's actually excited to go. | 190 | existing; mentions the free week: depends on Q2; [CONFIRM Q7] |
| `HOME.PROOF.T3.BY` | Hoa P. · Phụ huynh bé 7 tuổi, Gò Vấp | Hoa P. · Parent of a 7-year-old, Gò Vấp | 50 | |
| `HOME.PROOF.T3.NOTE` | Từ lớp 25 bạn sang lớp 8 bạn ✓ | From 25 in a class to 8 ✓ | 40 | |
| `HOME.PROOF.T4.QUOTE` | Chúng tôi khá lo lắng khi tìm lớp tiếng Anh với tư cách gia đình nước ngoài. Thầy Bek giúp con trai tôi thoải mái ngay từ buổi học thử đầu tiên, và lớp học thực sự an toàn cho trẻ nhỏ. | We were nervous about finding an English class as a foreign family. Teacher Bek made our son feel comfortable from the first trial lesson, and the classroom itself felt genuinely safe for a young child. | 230 | existing; [CONFIRM Q7] |
| `HOME.PROOF.T4.BY` | Yuki H. · Phụ huynh, gia đình nước ngoài ở Phú Nhuận | Yuki H. · Parent, expat family in Phú Nhuận | 60 | |
| `HOME.PROOF.T4.NOTE` | Thoải mái từ buổi học thử đầu tiên ✓ | Comfortable from the first trial lesson ✓ | 45 | |
| `HOME.PROOF.T5.QUOTE` | Tôi đã thi IELTS hai lần trước đó và bị chững điểm. Luyện đề có giới hạn thời gian và phản hồi thẳng thắn về điều đang khiến tôi mất điểm chính là điều tạo nên khác biệt. | I'd taken IELTS twice before and plateaued. The timed practice and honest feedback on exactly what was costing me points made the difference — no vague encouragement, just what to fix. | 220 | existing (EN has an extra clause "no vague encouragement…" missing in VI; keep VI as the master text unless owner prefers EN) [CONFIRM Q7] |
| `HOME.PROOF.T5.BY` | Sarah K. · Học viên IELTS, người lớn | Sarah K. · IELTS student, adult | 40 | |
| `HOME.PROOF.T5.NOTE` | IELTS lần thứ 3 · luyện đề tính giờ ✓ | Third IELTS attempt · timed practice ✓ | 45 | Do not add a band score unless verified [OWNER: band result, only if provable (Q4/Q7)] |
| `HOME.PROOF.T6.QUOTE` | Tôi cần điều hành cuộc họp bằng tiếng Anh, không chỉ đơn thuần tham gia cho xong. Chúng tôi luyện đúng ngôn ngữ tôi dùng ở công việc — thuyết trình, đàm phán, email khách hàng. | I needed to run meetings in English, not just get through them. We worked on the actual language I use at work — presentations, negotiation, client emails — not generic textbook units. | 200 | existing; [CONFIRM Q7] |
| `HOME.PROOF.T6.BY` | David R. · Học viên tiếng Anh công sở, ngành marketing | David R. · Work English student, marketing | 60 | |
| `HOME.PROOF.T6.NOTE` | Luyện đúng ngôn ngữ dùng ở công ty ✓ | Practising the language he actually uses at work ✓ | 50 | |
| `HOME.PROOF.GBP` | Xem đánh giá trên Google | See our Google reviews | 30 | [OWNER: Google Business Profile link and review count (Q7)] |
| `HOME.PROOF.SWIPE` | Vuốt để xem thêm | Swipe for more | 20 | Mobile deck |

### 1.6 Section 6 — Meet the teacher

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.TEACHER.H2` | Xin chào, thầy là Bek | Hi, I'm Bek | 24 | |
| `HOME.TEACHER.STORY1` | Thầy lớn lên ở Tashkent, Uzbekistan, nói tiếng Uzbek, tiếng Nga, rồi tiếng Anh. Với thầy, ngôn ngữ là khác biệt giữa được hiểu và bị lãng quên. | I grew up in Tashkent, Uzbekistan, speaking Uzbek, Russian and, in time, English. Language was the difference between being understood and being invisible. | 170 | existing timeline facts. [OWNER: OK to publish (P5)] |
| `HOME.TEACHER.STORY2` | Thầy đến Việt Nam để làm tình nguyện và chưa định dạy lâu dài. Thầy ở lại vì những khoảnh khắc nhỏ: một bé nói tự tin hơn một chút, một bé nhận ra mình diễn đạt được điều mà trước đó không dám nói. | I came to Vietnam to volunteer and never planned to stay in teaching. What kept me here were the small moments: a child speaking a little more confidently, or realising they can say something that once felt out of reach. | 230 | existing `about.story.p1–p2` |
| `HOME.TEACHER.CRED` | TESOL · PGCE · đang học MBA | TESOL · PGCE · MBA candidate | 40 | [CONFIRM Q4] each credential. NOTE: the existing key `about.credentials.delta` is labelled "MBA Candidate"; the plan mentions DELTA. Do not show DELTA |
| `HOME.TEACHER.EXP` | Từng dạy tại ILA Vietnam, BlueSky Kindergarten, các trường quốc tế và mầm non ở TP.HCM | Has taught at ILA Vietnam, BlueSky Kindergarten, international schools and kindergartens across HCMC | 100 | existing (`about.timeline`). [CONFIRM Q4]. "15+ schools" and "2,000+ students" are not used in this copy |
| `HOME.TEACHER.VIDEO_CARD` | Gặp thầy Bek (60 giây) | Meet Bek (60 seconds) | 28 | Video A [OWNER: shoot (Q8)] |
| `HOME.TEACHER.CAPTION` | Lớp học · Phú Nhuận · [ngày chụp] | Classroom · Phú Nhuận · [date taken] | 40 | Dated caption style. [OWNER: date (Q8)] |
| `HOME.TEACHER.SIGN` | Bek **(H)** | Bek **(H)** | handwritten | [OWNER: (Q9)] |
| `HOME.TEACHER.CTA` | Nhắn thầy qua Zalo | Message Bek on Zalo | 24 | |

### 1.7 Section 7 — The room (safety)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.ROOM.H2` | Căn phòng con sẽ học | The room your child learns in | 26 | |
| `HOME.ROOM.INTRO` | Lớp tối đa 10 bạn, trong một căn phòng nhỏ được chuẩn bị riêng để học và nói. An toàn cho trẻ. | At most 10 students in a small room made for speaking. Safe for children. | 110 | existing (`about.classroom.description`) |
| `HOME.ROOM.L1` | Camera an ninh | CCTV cameras | 20 | Handwritten-arrow label style but typeset. [OWNER: can parents watch live? Do not claim it unless true (P3)] |
| `HOME.ROOM.L2` | Máy lạnh | Air conditioning | 18 | existing |
| `HOME.ROOM.L3` | Nhà vệ sinh riêng | Private restroom | 22 | existing |
| `HOME.ROOM.L4` | Đèn diệt muỗi | Mosquito-killing lamps | 22 | existing (FAQ q8) |
| `HOME.ROOM.L5` | Tài liệu học | Learning materials | 20 | VI says "all materials provided"; EN says "fully equipped". [CONFIRM Q1: are materials in the fee?] |
| `HOME.ROOM.L6` | Chỗ để giày | Shoe rack | 18 | Only if it exists. [OWNER: confirm (P3)] |
| `HOME.ROOM.PICKUP` | Đón con: [quy định đón bé] | Pick-up: [pick-up policy] | 80 | [OWNER: who may collect a child, waiting area (P3)] |
| `HOME.ROOM.ADDRESS` | Golden Mansion 1, 119 Phổ Quang, Phú Nhuận | Golden Mansion 1, 119 Phổ Quang, Phú Nhuận | 60 | [CONFIRM Q11] |
| `HOME.ROOM.PARKING` | Gửi xe: [thông tin gửi xe] | Parking: [parking info] | 60 | [OWNER: (P3)] |
| `HOME.ROOM.MAP_ALT` | Bản đồ vị trí lớp học trên đường Phổ Quang, Phú Nhuận | Map showing the classroom on Phổ Quang, Phú Nhuận | 80 | Static image, no tiles |
| `HOME.ROOM.MAP_LINK` | Mở trên Google Maps | Open in Google Maps | 24 | existing |
| `HOME.ROOM.ALSO` | Thầy cũng dạy tại nhà học viên ở Phú Nhuận, Gò Vấp và Bình Thạnh. | I also teach at students' homes in Phú Nhuận, Gò Vấp and Bình Thạnh. | 80 | existing (FAQ q1). [CONFIRM Q11] and [OWNER: home visits still offered? Group-only policy vs home lessons (P4)] |

### 1.8 Section 8 — Ten Seats + invitation

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.SEATS.H2` | Lớp nhỏ có chủ ý | Small on purpose | 18 | |
| `HOME.SEATS.SUB` | Mỗi nhóm chỉ tối đa 10 bạn. Đây là các nhóm đang còn chỗ. | Every group has at most 10 students. Here is who has room. | 70 | [CONFIRM Q3] |
| `HOME.SEATS.GROUP` | Nhóm {tên} · {ngày giờ} | Group {name} · {days and time} | 40 | [CONFIRM Q3] group names and times |
| `HOME.SEATS.COUNT` | Còn {n}/10 chỗ | {n} of 10 seats free | 20 | [CONFIRM Q3] live number, weekly |
| `HOME.SEATS.UPDATED` | Cập nhật ngày {ngày} | Updated {date} | 24 | Auto-hide the counts when older than 14 days |
| `HOME.SEATS.FREE_A11Y` | Chỗ trống số {n}. Chạm để giữ chỗ. | Free seat {n}. Tap to hold it. | 50 | Seat ≥ 44 px, keyboard operable |
| `HOME.SEATS.TAKEN_A11Y` | Chỗ số {n} đã có bạn. | Seat {n} is taken. | 40 | |
| `HOME.SEATS.CTA` | Giữ chỗ và xem học phí | Hold a seat and see the fees | 32 | The invitation, not a paywall |
| `HOME.SEATS.NOTE` | Giữ chỗ chưa phải đóng tiền. Thầy giữ chỗ cho ba mẹ 48 giờ. | Holding a seat costs nothing. I keep it for 48 hours. | 80 | "48 hours" is a plan assumption [CONFIRM Q3]; "costs nothing" [CONFIRM Q2] |
| `HOME.SEATS.HIDDEN` | Hỏi thầy về chỗ trống | Ask about availability | 26 | Shown when seat data is stale (> 14 days) or not maintained |
| `HOME.SEATS.FULL` | Nhóm này đã đủ. Để lại số, thầy báo khi có chỗ. | This group is full. Leave your number and I'll tell you when a seat opens. | 70 | [OWNER: do you keep a waiting list? (P4)] |

### 1.9 Section 9 — FAQ (full text in `faq.md`)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.FAQ.H2` | Ba mẹ thường hỏi | Questions parents ask | 20 | |
| `HOME.FAQ.MORE` | Chưa thấy câu hỏi của mình? Nhắn thầy qua Zalo. | Don't see your question? Message me on Zalo. | 55 | |

### 1.10 Section 10 — Final call + footer

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `HOME.FINAL.H2` | Còn băn khoăn? Nhắn thầy qua Zalo. | Still wondering? Message me on Zalo. | 38 (7 words) | |
| `HOME.FINAL.REPLY` | Thầy trả lời trong vòng [X giờ], trong giờ làm việc. | I reply within [X hours] during working hours. | 60 | [CONFIRM Q6] reply time; site says both "24 hours" and "a few hours" |
| `HOME.FINAL.ZALO` | Nhắn Zalo | Message on Zalo | 14 | Big button; Zalo link + `zalo_click` event |
| `HOME.FINAL.CALL` | Gọi +84 353 88 5757 | Call +84 353 88 5757 | 24 | `tel:`. Phone from `MEMORY.md` / ConversionStrip [CONFIRM Q6] |
| `HOME.FINAL.HOLD` | Giữ chỗ | Hold a seat | 12 | |
| `HOME.FINAL.QR` | Quét mã để nhắn Zalo | Scan to message on Zalo | 26 | Desktop only. [OWNER: Zalo QR image (Q6)] |
| `HOME.FINAL.ADDRESS` | Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, TP.HCM | Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, Ho Chi Minh City | 70 | [CONFIRM Q11] |
| `HOME.FINAL.HOURS` | Giờ học: ngày thường 19:30–21:00 · cuối tuần 14:00–20:00 | Lesson hours: weekdays 19:30–21:00 · weekends 14:00–20:00 | 70 | [CONFIRM Q3] (the schema says Mon/Wed/Sat/Sun) |

---

## 2. Programme pages `/…/programmes/{slug}`

Common blocks on each page: Hero correction, who it's for, what you'll do, a sample week, a typical correction, schedule + seats, fee, 3 FAQs (from `faq.md`), form pre-filled. Common IDs below use the prefix `PROG.<CODE>.` with CODE = `YL`, `TEEN`, `IELTS`, `WORK`.

### 2.0 Shared labels

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `PROG.COMMON.WHO` | Dành cho | Who it's for | 14 | |
| `PROG.COMMON.NOTFOR` | Chưa phù hợp nếu | Not the right fit if | 24 | [OWNER: each programme's "not for" answer (P2)] |
| `PROG.COMMON.WHAT` | Con sẽ làm gì trong lớp | What you'll do in class | 30 | Adult pages: "Bạn sẽ làm gì trong lớp" |
| `PROG.COMMON.WEEK` | Một tuần học | A sample week | 20 | [OWNER: real weekly rhythm (P1)] |
| `PROG.COMMON.CORRECT` | Một lỗi thầy thường sửa | A mistake I often fix | 30 | |
| `PROG.COMMON.WHEN` | Lịch học và chỗ trống | Schedule and seats | 26 | |
| `PROG.COMMON.FEE` | Học phí | Fees | 10 | |
| `PROG.COMMON.FAQ` | Câu hỏi thường gặp | Common questions | 26 | 3 questions per page |
| `PROG.COMMON.CTA` | Giữ chỗ cho nhóm này | Hold a seat in this group | 28 | |
| `PROG.COMMON.FACTS_H` | Thông tin nhanh | Fast facts | 16 | AI/answer block |
| `PROG.COMMON.BACK` | Tất cả chương trình | All programmes | 22 | Breadcrumb |

### 2.1 Young Learners 6–10 (`/programmes/young-learners`)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `PROG.YL.META.TITLE` | Tiếng Anh cho bé 6–10 tuổi, Phú Nhuận \| Teacher Bek | English for Kids 6–10 in Phú Nhuận \| Teacher Bek | 60 | |
| `PROG.YL.META.DESC` | Lớp tiếng Anh cho bé 6–10 tuổi, tối đa 10 bé mỗi lớp. Bé được nói từ buổi đầu, trong phòng học an toàn có camera. Giữ chỗ qua Zalo hoặc biểu mẫu. | English classes for children 6–10, max 10 per class. Your child speaks from the first lesson in a safe room with CCTV. Hold a seat on Zalo or the form. | 155 | [CONFIRM Q3] max 10; [CONFIRM Q11] |
| `PROG.YL.H1` | Tiếng Anh cho bé 6–10 tuổi tại Phú Nhuận | English for kids aged 6–10 in Phú Nhuận | 9 words VI; 3 lines on mobile | SEO H1 |
| `PROG.YL.SENT` | She have a cat. → She has a cat. | She have a cat. → She has a cat. | 28 | `MIS.K02` |
| `PROG.YL.SUB` | Bé nói ngay từ buổi đầu, trong lớp nhỏ để bé nào cũng được nghe và được sửa lỗi nhẹ nhàng. | Your child speaks from the first lesson, in a class small enough that every child is heard and corrected kindly. | 110 | Based on existing tagline "Small groups. Speaking from session one." |
| `PROG.YL.WHO` | Bé 6–10 tuổi muốn nói tiếng Anh tự tin hơn, kể cả bé còn nhút nhát. | Children aged 6–10 who want to speak English with more confidence, including shy ones. | 90 | "kể cả bé nhút nhát": from testimonial Linh N. (existing). [OWNER: confirm no minimum level (P2)] |
| `PROG.YL.NOTFOR` | [OWNER: ví dụ: bé chưa biết đọc chữ cái / bé cần học 1 kèm 1] | [OWNER: e.g. child who can't read the alphabet / needs 1-to-1] | — | [OWNER: (P2)]; also: the site says group classes only |
| `PROG.YL.WHAT1` | Phát âm rõ hơn nhờ nói mỗi buổi, thay vì chỉ nghe và lặp lại | Clearer pronunciation from speaking every lesson, instead of listen-and-repeat | 90 | existing outcome 1 |
| `PROG.YL.WHAT2` | Học từ mới bằng cách dùng thật trong lớp, không học thuộc lòng | New words learned by using them in class, not by memorising lists | 90 | existing outcome 2 |
| `PROG.YL.WHAT3` | Tự tin được rèn luyện từng buổi một | Confidence built a little every lesson | 60 | existing outcome 3 |
| `PROG.YL.WHAT4` | Nền tảng vững cho tiếng Anh ở trường | A solid foundation for English at school | 60 | existing outcome 4 |
| `PROG.YL.WAY` | Bé học qua trò chuyện, trò chơi và hoạt động nhỏ theo nhóm. | Children learn by talking, playing and small group activities. | 80 | Replaces "acquisition through structured play". [OWNER: confirm games-based format (P1)] |
| `PROG.YL.WEEK` | [OWNER: một tuần mẫu: buổi 1 làm gì, buổi 2 làm gì] | [OWNER: sample week: what happens in lesson 1 and 2] | — | [OWNER: (P1)] |
| `PROG.YL.CORRECT` | She have a cat. → She has a cat. | She have a cat. → She has a cat. | 40 | "Với he/she/it, have đổi thành has." |
| `PROG.YL.FORMAT` | 2 buổi/tuần · 90 phút + 15 phút nghỉ | 2 lessons a week · 90 min + 15 min break | 45 | existing |
| `PROG.YL.WHEN` | [Nhóm A: ngày giờ] · [Nhóm B: ngày giờ] | [Group A: days and time] · [Group B: days and time] | — | [CONFIRM Q3]. Site says weekday evenings 19:30–21:00, weekends 14:00–20:00; 19:30 is late for ages 6–10 |
| `PROG.YL.SIZE` | Tối đa 10 bé mỗi lớp | At most 10 children per class | 30 | [CONFIRM Q3] |
| `PROG.YL.FEE` | từ 1.990.000 ₫/tháng | from 1,990,000 VND/month | 30 | [CONFIRM Q1] |
| `PROG.YL.PROOF` | Chọn từ: Linh N. (bé 8 tuổi), Hoa P. (bé 7 tuổi) | Use: Linh N. (age 8), Hoa P. (age 7) | — | [CONFIRM Q7] |
| `PROG.YL.FAQS` | FAQ.02 (lớp nhỏ), FAQ.07 (an toàn), FAQ.03 (học thử) | FAQ.02, FAQ.07, FAQ.03 | — | |

### 2.2 Teens 11–17 (`/programmes/teens`)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `PROG.TEEN.META.TITLE` | Tiếng Anh cho thiếu niên 11–17 tuổi \| Teacher Bek | English for Teens 11–17 in Phú Nhuận \| Teacher Bek | 60 | |
| `PROG.TEEN.META.DESC` | Lớp tiếng Anh cho con 11–17 tuổi, tối đa 10 bạn. Luyện nói không cần dịch trong đầu, làm bài và thuyết trình tự tin hơn. Thầy Bek, Phổ Quang, Phú Nhuận. | English classes for ages 11–17, max 10 students. Speak without translating in your head and present with confidence. Teacher Bek, Phú Nhuận. | 155 | [CONFIRM Q3], [CONFIRM Q11] |
| `PROG.TEEN.H1` | Tiếng Anh cho thiếu niên 11–17 tuổi tại Phú Nhuận | English for teens aged 11–17 in Phú Nhuận | 10 words VI | SEO H1; "thiếu niên" matches existing programme name; parents also search "teen" |
| `PROG.TEEN.SENT` | I am agree with you. → I agree with you. | I am agree with you. → I agree with you. | 28 | `MIS.T01` |
| `PROG.TEEN.SUB` | Nói tiếng Anh mà không phải dịch trong đầu. Học để dùng ở trường và ngoài đời. | Speak English without translating in your head. Learn it for school and for real life. | 90 | existing tagline + outcome 1 |
| `PROG.TEEN.WHO` | Con 11–17 tuổi muốn nói trôi chảy hơn, làm bài và thuyết trình ở trường tự tin hơn. | Ages 11–17 who want to speak more fluently and feel more confident in schoolwork and presentations. | 100 | Presentation point from testimonial Minh T. |
| `PROG.TEEN.NOTFOR` | [OWNER: ví dụ: con chỉ cần ôn thi chuyển cấp trong vài tuần] | [OWNER: e.g. a teen who only needs a few weeks of exam cramming] | — | [OWNER: (P2)] |
| `PROG.TEEN.WHAT1` | Nói tiếng Anh mà không bị "trễ" vì dịch trong đầu | Speaking without the delay of translating in your head | 80 | existing outcome 1 |
| `PROG.TEEN.WHAT2` | Làm bài và thi ở trường tốt hơn | Stronger schoolwork and exams | 50 | existing outcome 2 (a hope, not a promise: keep the wording soft) |
| `PROG.TEEN.WHAT3` | Kỹ năng giao tiếp trong tình huống thật | Communication skills for real situations | 60 | existing outcome 3 |
| `PROG.TEEN.WHAT4` | Tư duy phản biện bằng tiếng Anh | Critical thinking in English | 40 | existing outcome 4 |
| `PROG.TEEN.WEEK` | [OWNER: một tuần mẫu] | [OWNER: sample week] | — | [OWNER: (P1)] |
| `PROG.TEEN.CORRECT` | I am agree with you. → I agree with you. | same | 40 | "Agree đã là động từ, không cần am." |
| `PROG.TEEN.FORMAT` | 2 buổi/tuần · 90 phút + 15 phút nghỉ | 2 lessons a week · 90 min + 15 min break | 45 | existing |
| `PROG.TEEN.WHEN` | [Nhóm: ngày giờ] | [Group: days and time] | — | [CONFIRM Q3] |
| `PROG.TEEN.SIZE` | Tối đa 10 bạn mỗi lớp | At most 10 students per class | 30 | [CONFIRM Q3] |
| `PROG.TEEN.FEE` | từ 1.990.000 ₫/tháng | from 1,990,000 VND/month | 30 | [CONFIRM Q1] |
| `PROG.TEEN.PROOF` | Chọn từ: Minh T. (con 14 tuổi) | Use: Minh T. (age 14) | — | [CONFIRM Q7] |
| `PROG.TEEN.FAQS` | FAQ.01 (độ tuổi), FAQ.02, FAQ.06 | FAQ.01, FAQ.02, FAQ.06 | — | |

### 2.3 IELTS (`/programmes/ielts`)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `PROG.IELTS.META.TITLE` | Luyện thi IELTS nhóm nhỏ, Phú Nhuận \| Teacher Bek | IELTS Preparation in Phu Nhuan \| Teacher Bek | 60 | EN uses plan's ASCII spelling "Phu Nhuan" for search |
| `PROG.IELTS.META.DESC` | Luyện thi IELTS nhóm nhỏ tối đa 10 bạn: đủ 4 kỹ năng, làm bài có tính giờ và phản hồi thẳng thắn về điều đang làm bạn mất điểm. Thầy Bek, Phú Nhuận. | IELTS preparation in small groups of up to 10: all four skills, timed practice and honest feedback on what is costing you points. Teacher Bek, Phú Nhuận. | 155 | [CONFIRM Q3] |
| `PROG.IELTS.H1` | Luyện thi IELTS nhóm nhỏ tại Phú Nhuận | Small-group IELTS preparation in Phú Nhuận | 8 words VI | SEO H1 |
| `PROG.IELTS.SENT` | Technology make life easier. → Technology makes life easier. | same | 28 | `MIS.A04` |
| `PROG.IELTS.SUB` | Điểm band đến từ sự rõ ràng. Thầy luyện sự rõ ràng, và nói thẳng bạn đang đứng ở đâu. | Band scores follow clarity. We train clarity, and I tell you straight where you stand. | 100 | existing tagline "Band scores follow clarity. We train clarity." |
| `PROG.IELTS.WHO` | Người học ở mọi mục tiêu band, cho hồ sơ đại học hoặc định cư. | Learners at any band target, for university applications or immigration. | 90 | existing highlight. [OWNER: minimum age and level (P2)] |
| `PROG.IELTS.NOTFOR` | [OWNER: ví dụ: chưa biết tiếng Anh cơ bản] | [OWNER: e.g. complete beginners] | — | [OWNER: (P2)] |
| `PROG.IELTS.WHAT1` | Cả 4 kỹ năng: Đọc, Viết, Nghe, Nói | All four skills: Reading, Writing, Listening, Speaking | 60 | existing |
| `PROG.IELTS.WHAT2` | Chiến lược làm bài và quản lý thời gian khi áp lực | Test strategy and time management under pressure | 70 | existing |
| `PROG.IELTS.WHAT3` | Phản hồi chi tiết trên các bài luyện có tính giờ | Detailed feedback on timed practice tests | 70 | existing |
| `PROG.IELTS.WHAT4` | Biết rõ mình đang ở đâu, không nói giảm nói tránh | A clear, honest read on where you stand | 70 | existing |
| `PROG.IELTS.WEEK` | [OWNER: một tuần mẫu] | [OWNER: sample week] | — | [OWNER: (P1)] |
| `PROG.IELTS.CORRECT` | Technology make life easier. → Technology makes life easier. | same | 40 | "Lỗi hay mất điểm ở Writing." |
| `PROG.IELTS.FORMAT` | 2 buổi/tuần · 60 phút | 2 lessons a week · 60 min | 30 | existing |
| `PROG.IELTS.WHEN` | [Nhóm: ngày giờ] | [Group: days and time] | — | [CONFIRM Q3] |
| `PROG.IELTS.SIZE` | Tối đa 10 bạn mỗi lớp | At most 10 students per class | 30 | [CONFIRM Q3] |
| `PROG.IELTS.FEE` | từ 1.990.000 ₫/tháng | from 1,990,000 VND/month | 30 | [CONFIRM Q1] |
| `PROG.IELTS.PROOF` | Chọn từ: Sarah K. | Use: Sarah K. | — | [CONFIRM Q7]. A band result only if verified [CONFIRM Q4] |
| `PROG.IELTS.FAQS` | FAQ.04 (học phí), FAQ.06 (lịch học), FAQ.08 (bằng cấp) | FAQ.04, FAQ.06, FAQ.08 | — | |

### 2.4 English for Work (`/programmes/english-for-work`)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `PROG.WORK.META.TITLE` | Tiếng Anh công sở, Phú Nhuận \| Teacher Bek | English for Work in Phú Nhuận \| Teacher Bek | 60 | |
| `PROG.WORK.META.DESC` | Tiếng Anh cho phỏng vấn, thuyết trình, họp và email công việc. Lớp nhóm nhỏ tối đa 10 bạn, luyện đúng ngôn ngữ bạn dùng ở công ty. Thầy Bek, Phú Nhuận. | English for interviews, presentations, meetings and work email. Groups of up to 10, practising the language you use at work. Teacher Bek, Phú Nhuận. | 155 | [CONFIRM Q3] |
| `PROG.WORK.H1` | Tiếng Anh công sở cho người đi làm tại Phú Nhuận | English for working professionals in Phú Nhuận | 10 words VI | SEO H1 |
| `PROG.WORK.SENT` | I am graduated in 2020. → I graduated in 2020. | same | 28 | `MIS.A08` (interview answer) |
| `PROG.WORK.SUB` | Tiếng Anh chuyên nghiệp cho phỏng vấn, họp và khách hàng, đúng ngôn ngữ bạn dùng ở công ty. | Professional English for interviews, meetings and clients: the language you actually use at work. | 100 | existing tagline + testimonial David R. |
| `PROG.WORK.WHO` | Người đi làm ở mọi trình độ cần nói tiếng Anh trong công việc. | Working adults at any level who need English on the job. | 80 | "All levels" (existing subtitle) |
| `PROG.WORK.NOTFOR` | [OWNER: ví dụ: cần chứng chỉ IELTS để nộp hồ sơ → xem lớp IELTS] | [OWNER: e.g. needs an IELTS score → see IELTS] | — | [OWNER: (P2)] |
| `PROG.WORK.WHAT1` | Phỏng vấn và thuyết trình bằng tiếng Anh | Interviews and presentations in English | 50 | existing |
| `PROG.WORK.WHAT2` | Email và viết lách trong công việc | Business email and writing | 50 | existing |
| `PROG.WORK.WHAT3` | Ngôn ngữ cho cuộc họp và đàm phán | Meeting and negotiation language | 50 | existing |
| `PROG.WORK.WHAT4` | Kỹ năng giao tiếp với khách hàng | Client communication skills | 50 | existing |
| `PROG.WORK.WEEK` | [OWNER: một tuần mẫu] | [OWNER: sample week] | — | [OWNER: (P1)] |
| `PROG.WORK.CORRECT` | I am graduated in 2020. → I graduated in 2020. | same | 40 | "Tiếng Anh dùng quá khứ đơn, không dùng am." |
| `PROG.WORK.FORMAT` | 2 buổi/tuần · 90 phút + 15 phút nghỉ | 2 lessons a week · 90 min + 15 min break | 45 | existing |
| `PROG.WORK.WHEN` | [Nhóm: ngày giờ] | [Group: days and time] | — | [CONFIRM Q3] |
| `PROG.WORK.SIZE` | Tối đa 10 bạn mỗi lớp | At most 10 students per class | 30 | [CONFIRM Q3] |
| `PROG.WORK.FEE` | 3.000.000 ₫/tháng | 3,000,000 VND/month | 30 | [CONFIRM Q1]: the only programme with an exact (not "from") fee on the current site |
| `PROG.WORK.PROOF` | Chọn từ: David R. | Use: David R. | — | [CONFIRM Q7] |
| `PROG.WORK.FAQS` | FAQ.04, FAQ.05 (hợp đồng), FAQ.06 | FAQ.04, FAQ.05, FAQ.06 | — | |

---

## 3. Hold-a-seat form (bottom sheet mobile / side sheet desktop) and `/hold-a-seat`

Pipeline notes for copy: errors are shown by the pen in the margin (typeset text, a handwritten ○ or ✗ mark **(H)**) and announced in an `aria-live="polite"` region. The submit button never looks disabled; it shows what is missing. Existing error strings in `messages/*.json` namespace `leads.*` are reused where marked.

### 3.1 Frame

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `FORM.TITLE` | Giữ chỗ | Hold a seat | 12 | Sheet heading |
| `FORM.STEP_LABEL` | Bước {n} trên 3 | Step {n} of 3 | 16 | Progress shown as ✓ ✓ ○ **(H)** |
| `FORM.CLOSE` | Đóng | Close | 8 | `aria-label`: "Đóng biểu mẫu" / "Close form" |
| `FORM.ZALO_ALT` | Muốn nhắn trực tiếp? Nhắn Zalo | Prefer to chat? Message on Zalo | 40 | Always visible |
| `FORM.PRIVACY_HINT` | Thầy chỉ dùng thông tin này để liên hệ về lớp học. Không spam. | I only use this to contact you about lessons. No spam. | 70 | existing (`pricingGate.privacyNote`) |

### 3.2 Step 1 — Who is learning?

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `FORM.S1.Q` | Ai sẽ học? | Who is learning? | 14 | |
| `FORM.S1.HELP` | Chọn một. Thầy sẽ gợi ý nhóm phù hợp. | Pick one. I'll suggest the right group. | 50 | |
| `FORM.S1.C1` | Con tôi, 6–10 tuổi | My child, 6–10 | 22 | |
| `FORM.S1.C2` | Con tôi, 11–17 tuổi | My child, 11–17 | 22 | |
| `FORM.S1.C3` | Tôi (người lớn) | Me (an adult) | 18 | |
| `FORM.S1.C4` | Luyện thi IELTS | IELTS preparation | 22 | |
| `FORM.S1.C5` | Tiếng Anh đi làm | English for work | 22 | The plan lists four chips; the fifth is added because English for Work is a programme |
| `FORM.S1.ERR` | Chọn một lựa chọn để tiếp tục nhé. | Please pick one to continue. | 40 | |

### 3.3 Step 2 — What matters most?

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `FORM.S2.Q` | Điều gì quan trọng nhất? | What matters most? | 28 | |
| `FORM.S2.HELP` | Chọn nhiều cũng được. | Pick as many as you like. | 30 | |
| `FORM.S2.C1` | Tự tin nói tiếng Anh | Speaking with confidence | 26 | from `inquiry.goalSpeaking` |
| `FORM.S2.C2` | Điểm ở trường | School grades | 18 | from `inquiry.goalSchool` |
| `FORM.S2.C3` | Điểm IELTS | An IELTS score | 18 | from `inquiry.goalIelts` |
| `FORM.S2.C4` | Tiếng Anh đi làm | English for work | 22 | from `inquiry.goalWork` |
| `FORM.S2.DAYS_Q` | Ngày giờ nào tiện nhất? (không bắt buộc) | Which days suit you? (optional) | 45 | |
| `FORM.S2.D1` | Tối ngày thường | Weekday evenings | 20 | [CONFIRM Q3] |
| `FORM.S2.D2` | Cuối tuần | Weekends | 14 | [CONFIRM Q3] |
| `FORM.S2.D3` | Chưa chắc | Not sure yet | 14 | |
| `FORM.S2.ERR` | Chọn ít nhất một mục nhé. | Please pick at least one. | 36 | |

### 3.4 Step 3 — Where should I send your answer key?

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `FORM.S3.Q` | Thầy gửi đáp án cho ba mẹ ở đâu? | Where should I send your answer key? | 36 | Adult variant `FORM.S3.Q_ADULT`: "Thầy gửi đáp án cho bạn ở đâu?" |
| `FORM.S3.HELP` | Đáp án = bảng học phí và lịch học thử riêng cho con. | The answer key is your personal fee sheet and trial schedule. | 70 | [CONFIRM Q1], [CONFIRM Q2] what it contains |
| `FORM.S3.NAME` | Tên ba mẹ | Parent's name | 16 | Adult variant: "Tên của bạn" / "Your name" |
| `FORM.S3.NAME_PH` | Ví dụ: Nguyễn Thu Hà | e.g. Linh Nguyen | 30 | placeholder ≥ 4.5:1 contrast |
| `FORM.S3.PHONE` | Số Zalo hoặc điện thoại | Zalo or phone number | 28 | |
| `FORM.S3.PHONE_PH` | 09xx xxx xxx | 09xx xxx xxx | 16 | auto-format; `inputmode="tel"`; accepts `+84` |
| `FORM.S3.PHONE_HELP` | Thầy sẽ nhắn Zalo cho ba mẹ trong vòng [X giờ]. | I'll message you on Zalo within [X hours]. | 60 | [CONFIRM Q6] reply time |
| `FORM.S3.EMAIL` | Email (không bắt buộc) | Email (optional) | 24 | |
| `FORM.S3.EMAIL_PH` | email@cua-ban.com | you@email.com | 24 | existing VI placeholder style |
| `FORM.S3.EMAIL_HELP` | Thầy gửi thêm một bản đáp án qua email. | I'll also email you a copy. | 50 | |
| `FORM.S3.CONSENT` | Tôi đồng ý để Teacher Bek lưu tên, số Zalo/điện thoại (và email nếu có) của tôi để liên hệ về lớp học và gửi bảng học phí. Tôi có thể nhắn thầy để yêu cầu xóa thông tin bất cứ lúc nào. | I agree that Teacher Bek stores my name, Zalo/phone number (and email, if given) to contact me about lessons and send the fee sheet. I can message him to ask for my details to be deleted at any time. | 260 | Unticked by default. [OWNER: lawyer must approve wording, retention period, processors named (Vercel/Cloudflare/Resend/Google per final stack), data-request contact (P7)] |
| `FORM.S3.CONSENT_LINK` | Xem chính sách quyền riêng tư | Read the privacy notice | 36 | [OWNER: privacy page translated before launch, VI at least (P7)] |
| `FORM.S3.SUBMIT` | Nhận đáp án → | Get my answer key → | 20 | Always enabled; red-pen fill |
| `FORM.S3.SUBMITTING` | Đang gửi… | Sending… | 14 | |
| `FORM.BACK` | Quay lại | Back | 12 | |
| `FORM.NEXT` | Tiếp tục | Continue | 12 | |
| `FORM.MISSING` | Còn thiếu: {danh sách} | Still missing: {list} | 40 | Shown under the button when pressed with gaps. Field names: "tên", "số Zalo hoặc điện thoại", "đồng ý" / "name", "Zalo or phone number", "consent" |

### 3.5 Validation and system messages

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `FORM.ERR.NAME` | Ba mẹ cho thầy biết tên nhé. | Please tell me your name. | 40 | |
| `FORM.ERR.PHONE_EMPTY` | Cho thầy xin số Zalo hoặc điện thoại để gửi đáp án nhé. | I need a Zalo or phone number to send your answer key. | 60 | |
| `FORM.ERR.PHONE_BAD` | Gần đúng rồi. Ba mẹ kiểm tra lại số điện thoại nhé. | Almost. Please check your phone number. | 60 | Pen writes "Almost!" **(H)**; plan wording |
| `FORM.ERR.EMAIL_BAD` | Email này chưa đúng. Ba mẹ kiểm tra lại, hoặc bỏ trống cũng được. | That email doesn't look right. Check it, or leave it empty. | 70 | |
| `FORM.ERR.CONSENT` | Ba mẹ tích vào ô đồng ý để thầy gửi đáp án nhé. | Please tick the box so I can send your answer key. | 60 | |
| `FORM.ERR.RATE` | Ba mẹ đã thử nhiều lần. Đợi một phút rồi thử lại nhé. | Too many tries. Wait a minute and try again. | 60 | existing key `leads.errorRateLimited` (rephrased) |
| `FORM.ERR.CAPTCHA` | Kiểm tra bảo mật chưa xong. Ba mẹ đợi một chút rồi gửi lại nhé. | The security check isn't finished. Wait a moment and send again. | 70 | existing `leads.errorCaptcha` |
| `FORM.ERR.NETWORK` | Mạng đang chập chờn. Ba mẹ thử lại, hoặc nhắn thầy qua Zalo. | Your connection dropped. Try again, or message me on Zalo. | 70 | existing `leads.errorNetwork` |
| `FORM.ERR.SERVER` | Chưa gửi được lúc này. Thông tin của ba mẹ vẫn còn đây. Ba mẹ nhắn thầy qua Zalo hoặc gọi trực tiếp nhé. | We couldn't send it just now. Your details are still here. Message me on Zalo or call directly. | 120 | existing `leads.errorDelivery` + `leads.fallbackHint`. Must show Zalo + phone buttons |
| `FORM.ERR.OFFLINE` | Mất mạng? Ba mẹ gọi +84 353 88 5757. | No signal? Call +84 353 88 5757. | 50 | plan §4.2 [CONFIRM Q6] |
| `FORM.ERR.SPAM` | Ba mẹ điền chậm lại một chút rồi gửi lại nhé. | Please take a moment to fill in the form, then send again. | 70 | existing `leads.errorSpam` |
| `FORM.OK.TITLE` | Đã nhận! Thầy đang mở đáp án cho ba mẹ… | Got it! Opening your answer key… | 60 | Transition to Answer Key |
| `FORM.OK.SEAT` | Chỗ của ba mẹ được giữ 48 giờ. | Your seat is held for 48 hours. | 50 | [CONFIRM Q3] |
| `FORM.OK.ZALO` | Thầy cũng sẽ nhắn Zalo cho ba mẹ. | I'll also message you on Zalo. | 50 | [CONFIRM Q6] |
| `FORM.PREFILL` | Đã chọn sẵn: {nhóm} | Pre-selected: {group} | 40 | When opened from a seat or programme page |
| `FORM.PAGE.H1` | Giữ chỗ cho con | Hold a seat for your child | 20 | `/hold-a-seat` page H1 (SEO) |
| `FORM.PAGE.META.TITLE` | Giữ chỗ lớp tiếng Anh, Phú Nhuận \| Teacher Bek | Hold a Seat in an English Class \| Teacher Bek | 60 | |
| `FORM.PAGE.META.DESC` | Chọn nhóm, để lại số Zalo và nhận bảng học phí, lịch học thử riêng cho con. Mỗi nhóm tối đa 10 bạn. | Pick a group, leave your Zalo number and get your personal fee sheet and trial schedule. Max 10 per group. | 155 | [CONFIRM Q1], [CONFIRM Q2], [CONFIRM Q3] |

---

## 4. Answer Key page `/…/answer-key/[token]` (noindex)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `KEY.META.TITLE` | Đáp án của bạn \| Teacher Bek | Your Answer Key \| Teacher Bek | 60 | `noindex`; no OG |
| `KEY.H1` | Đáp án dành cho {tên} | Your answer key, {name} | 28 | |
| `KEY.SUB` | Bảng học phí, lịch học thử và chỗ thầy đang giữ cho {chương trình}. | Your fee sheet, trial schedule and the seat I'm holding for {programme}. | 90 | |
| `KEY.UNFOLD_A11Y` | Đáp án đã mở ra | The answer key has opened | 30 | `aria-live`; the unfold is skipped under reduced motion |
| `KEY.PROGRAMME_H` | Chương trình phù hợp | The right programme | 24 | |
| `KEY.PROGRAMME_NOTE` | {tên chương trình} · {độ tuổi} · {số buổi} · {giờ học} | {programme} · {age} · {lessons} · {hours} | 80 | Pen circles the recommended option |
| `KEY.FEE_H` | Học phí | Fees | 10 | |
| `KEY.FEE_ROW` | Học phí theo tháng: [X] ₫ | Monthly fee: [X] VND | 40 | [CONFIRM Q1] price per programme; payment methods and refund rules [OWNER: (P7)] |
| `KEY.FEE_INCLUDES` | Đã bao gồm: [tài liệu / …] | Includes: [materials / …] | 60 | [CONFIRM Q1] what is included |
| `KEY.TRIAL_H` | Học thử | Trial | 10 | |
| `KEY.TRIAL_BODY` | [Mô tả buổi học thử: một tuần miễn phí hay giảm giá tháng đầu, buổi học thử diễn ra thế nào] | [Describe the trial: free week or discounted first month, what exactly happens] | 160 | [CONFIRM Q2] |
| `KEY.SEAT_H` | Chỗ đang giữ | Your held seat | 18 | |
| `KEY.SEAT_BODY` | Thầy giữ chỗ nhóm {nhóm} cho ba mẹ đến {ngày giờ hết hạn}. | I'm holding a seat in group {group} until {expiry}. | 70 | [CONFIRM Q3] 48 h hold |
| `KEY.PEN_TRIAL` | Trial: {date}? **(H)** | Trial: {date}? **(H)** | handwritten | English only; Q9 |
| `KEY.BOOK` | Chọn giờ học thử | Choose a trial time | 22 | Cal.com link. [OWNER: Cal.com account (Q6)] |
| `KEY.ZALO` | Hoặc nhắn thầy qua Zalo | Or message me on Zalo | 28 | |
| `KEY.SHARE` | Gửi cho người nhà | Share with your family | 22 | Copy-link button; spouse/grandparents |
| `KEY.SHARE_OK` | Đã chép liên kết | Link copied | 16 | |
| `KEY.NOTE_PRIVATE` | Trang này không hiện trên Google. Ai có liên kết đều xem được, nên ba mẹ chỉ gửi cho người nhà. | This page isn't listed on Google. Anyone with the link can see it, so only share it with family. | 120 | [OWNER: link expiry (P7)] |
| `KEY.EXPIRED_H` | Đáp án này đã hết hạn | This answer key has expired | 30 | |
| `KEY.EXPIRED_BODY` | Ba mẹ nhắn thầy qua Zalo, thầy gửi lại ngay. | Message me on Zalo and I'll send it again. | 60 | |
| `KEY.EMAIL_SUBJECT` | Đáp án của {tên} từ Teacher Bek | Your answer key from Teacher Bek, {name} | 60 | Plain confirmation email subject |

---

## 5. 404 page "This page has a mistake"

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `E404.META.TITLE` | Trang này có lỗi \| Teacher Bek | This page has a mistake \| Teacher Bek | 60 | `noindex`, status 404 |
| `E404.SENT_WRONG` | This page have a mistake. | This page have a mistake. | 28 | English in every locale; the pen then corrects `have` → `has` **(H)** "has" |
| `E404.SENT_RIGHT` | This page has a mistake. | This page has a mistake. | 28 | |
| `E404.H1` | Trang này bị lỗi rồi | This page has a mistake | 24 | Single `<h1>` |
| `E404.BODY` | Đường dẫn này không còn nữa, hoặc đã được chuyển đi. Mình sửa lại nhé. | The link is gone, or has moved. Let's correct it. | 80 | Replaces existing `notFound.body`. Dev note: gentle fix tone |
| `E404.LINK_HOME` | Về trang chủ | Back to home | 18 | The corrected sentence also becomes this link |
| `E404.LINK_PROG` | Xem các chương trình | See the programmes | 24 | |
| `E404.LINK_HOLD` | Giữ chỗ | Hold a seat | 12 | |
| `E404.LINK_ZALO` | Nhắn Zalo | Message on Zalo | 14 | |

---

## 6. Footer (all pages)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `FOOT.TAGLINE` | Thầy Bek, giáo viên tiếng Anh ở Phú Nhuận, TP.HCM. Lớp nhóm nhỏ, tối đa 10 bạn. | Teacher Bek, English teacher in Phú Nhuận, Ho Chi Minh City. Small groups, max 10 students. | 100 | Does not repeat "2,000+" or "Gần 2.000" (conflict). [CONFIRM Q4] if the number is to return |
| `FOOT.CRED` | TESOL · PGCE · đang học MBA | TESOL · PGCE · MBA candidate | 40 | [CONFIRM Q4] |
| `FOOT.ADDR_H` | Địa chỉ | Address | 12 | |
| `FOOT.ADDR` | Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, TP.HCM | Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, Ho Chi Minh City | 70 | [CONFIRM Q11]; identical NAP everywhere |
| `FOOT.AREAS` | Cũng dạy tại Gò Vấp và Bình Thạnh | Also teaching in Gò Vấp and Bình Thạnh | 40 | existing. [CONFIRM Q11] |
| `FOOT.HOURS_H` | Giờ học | Lesson hours | 14 | |
| `FOOT.HOURS` | Ngày thường 19:30–21:00 · Cuối tuần 14:00–20:00 | Weekdays 19:30–21:00 · Weekends 14:00–20:00 | 60 | [CONFIRM Q3] |
| `FOOT.CONTACT_H` | Liên hệ | Contact | 12 | |
| `FOOT.ZALO` | Zalo | Zalo | 8 | The existing footer labelled the Zalo link "Telegram" (bug); label = link target |
| `FOOT.PHONE` | +84 353 88 5757 | +84 353 88 5757 | 20 | `tel:` |
| `FOOT.EMAIL` | hello@teacherbek.com | hello@teacherbek.com | 30 | [CONFIRM Q5] receives mail |
| `FOOT.WHATSAPP` | WhatsApp | WhatsApp | 10 | Remove unless [CONFIRM Q15] = yes |
| `FOOT.SOCIAL_H` | Theo dõi | Follow | 12 | Facebook, Instagram, TikTok, LinkedIn: only live, owned links [OWNER: list of accounts (Q13)] |
| `FOOT.LEGAL_H` | Pháp lý | Legal | 10 | |
| `FOOT.PRIVACY` | Quyền riêng tư | Privacy | 16 | |
| `FOOT.TERMS` | Điều khoản | Terms | 12 | |
| `FOOT.LANG_H` | Ngôn ngữ | Language | 12 | Only shipped locales (Q10) |
| `FOOT.TOP` | Về đầu trang | Back to top | 14 | |
| `FOOT.COPY` | © 2026 Teacher Bek | © 2026 Teacher Bek | 30 | [OWNER: legal/business name if registered (Q6)] |

---

## 7. Sticky bottom bar (mobile, 64 px, safe-area aware)

Replaces the floating Zalo bubble. Hides while scrolling down inside a form and returns on scroll up; never covers a focused input.

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `BAR.ZALO` | Zalo | Zalo | 8 | Icon + label, left, outline |
| `BAR.ZALO_A11Y` | Nhắn thầy Bek qua Zalo | Message Teacher Bek on Zalo | 40 | `aria-label` |
| `BAR.HOLD` | Giữ chỗ | Hold a seat | 12 | Right, red-pen fill |
| `BAR.HOLD_A11Y` | Giữ chỗ lớp tiếng Anh | Hold a seat in a class | 40 | |

---

## 8. Menu (full-screen paper sheet on mobile; header on desktop)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `MENU.OPEN` | Mở menu | Open menu | 12 | `aria-label` on a 48×48 button |
| `MENU.CLOSE` | Đóng menu | Close menu | 12 | `aria-label`; second close at the bottom of the sheet; Escape and back gesture close it |
| `MENU.PROG` | Chương trình | Programmes | 16 | Sub-links below |
| `MENU.PROG_YL` | Bé 6–10 tuổi | Kids 6–10 | 18 | |
| `MENU.PROG_TEEN` | Thiếu niên 11–17 | Teens 11–17 | 18 | |
| `MENU.PROG_IELTS` | Luyện thi IELTS | IELTS | 18 | |
| `MENU.PROG_WORK` | Tiếng Anh công sở | English for Work | 20 | |
| `MENU.ABOUT` | Về thầy Bek | About Bek | 16 | |
| `MENU.ROOM` | Lớp học | The classroom | 14 | |
| `MENU.SEATS` | Chỗ trống | Seats | 14 | |
| `MENU.FAQ` | Hỏi đáp | FAQ | 12 | existing nav label |
| `MENU.GUIDES` | Bài viết | Guides | 12 | Only when the guides launch [OWNER: hours/month for content (Q14)] |
| `MENU.CONTACT` | Liên hệ | Contact | 12 | |
| `MENU.CTA` | Giữ chỗ | Hold a seat | 12 | |
| `MENU.LANG` | Ngôn ngữ | Language | 12 | VI · EN (· 中文 · РУС when Q10 allows) |
| `MENU.THEME_DARK` | Chế độ tối | Dark mode | 14 | Toggle visible in the header, not hidden in the menu |
| `MENU.THEME_LIGHT` | Chế độ sáng | Light mode | 14 | |
| `MENU.SKIP` | Bỏ qua, đến nội dung chính | Skip to main content | 40 | Skip link on every page |
| `MENU.PHONE` | Gọi +84 353 88 5757 | Call +84 353 88 5757 | 24 | Bottom of the sheet |

---

## 9. Cookie notice (small bottom banner, not a wall)

| ID | VI | EN | Max | Flags |
|---|---|---|---|---|
| `COOKIE.TEXT` | Trang dùng thống kê ẩn danh để thầy cải thiện nội dung. Ba mẹ đồng ý nhé? | This site uses anonymous analytics so I can improve it. Is that OK? | 90 | [OWNER: lawyer review, GA4 only after consent (P7)] |
| `COOKIE.ACCEPT` | Đồng ý | Accept | 10 | |
| `COOKIE.DECLINE` | Chỉ dùng cần thiết | Essential only | 20 | |

---

## 10. Counts

| Block | Items |
|---|---|
| Home sections | 10 |
| Programme pages | 4 |
| Form (3 steps + frame + messages) | 1 flow |
| Answer Key, 404, footer, sticky bar, menu, cookie | 6 |

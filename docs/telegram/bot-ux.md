# Telegram admin bot: UX reference

Owner-facing, English only. All copy lives in one `strings` object (`lib/telegram/strings.ts`), so a Vietnamese set can be added later. The bot is private: only chat ids in `TELEGRAM_ADMIN_CHAT_IDS` get answers. Anyone else gets one line, "Sorry, this bot is private.", and no data.

Code map: `lib/telegram/` = `api.ts` (Bot API client, 429 retry), `config.ts` (admins, constant-time secret), `format.ts` (HTML cards, escaping, stats text), `keyboards.ts` (keyboards + callback codec), `views.ts` (screens), `handlers.ts` (commands, callbacks, note flow), `router.ts` (admin check, never throws), `notify.ts` (new-lead push). Webhook: `app/api/telegram/route.ts`. Sheet client: `lib/leads/sheet.ts`.

## Navigation

Persistent reply keyboard (`is_persistent`, `resize_keyboard`), shown by /start:

```
[ 🆕 New ] [ 📋 Leads ] [ 📊 Stats ]
[ 🔎 Search ] [ ❓ Help ]
```

Tapping a button sends the same handler as its command.

| Command | Button | Does |
| --- | --- | --- |
| /start | | Welcome card, shows the keyboard |
| /new | 🆕 New | List filtered to status New |
| /leads | 📋 Leads | List, all statuses |
| /today | | List of leads received today (Ho Chi Minh time) |
| /stats | 📊 Stats | Dashboard, this month |
| /search [text] | 🔎 Search | Prompt (ForceReply) or direct search when text follows the command |
| /help | ❓ Help | Command list |

Commands are registered per admin chat (`BotCommandScopeChat`) by `scripts/telegram-setup.mjs`; the default scope only has /start. The menu button is set to "commands".

## Screens

### Lead card

```
🔔 New lead                       <- only on the push notification
🟡 Linh Nguyen · New
📚 Programme: Young Learners
👤 Who: Child, 8 years · Beginner
🎯 Goal: Speaking confidence
🇻🇳 Language: Vietnamese
📥 Source: Contact form
🕒 Received: 21 Oct, 19:42 (2h ago)

📞 0912 345 678                   <- <code>, tap to copy
✉️ linh@example.com

💬 Message
▏ expandable quote ...

📝 Notes
• 21 Oct, 21:10 — Prefers evenings
🕘 History
🔵 Contacted · 21 Oct, 21:05

[📋 Copy phone] [💬 Zalo] [🟢 WhatsApp]
[New] [✓ Contacted] [Trial]
[Enrolled] [Lost]
[📝 Add note] [⬅️ Back to list]
```

- HTML parse mode, every user-supplied value escaped (`& < > "`), link previews off, always within 4096 characters (the message is trimmed first, then notes, then fewer notes).
- Zalo / WhatsApp links use the phone with a leading 0 replaced by 84.
- Status buttons use button `style` (current = primary, Enrolled = success, Lost = danger). If Telegram ever rejects `style`, the call is retried once without it.
- Tapping a status: sheet updated, toast "Marked as Contacted", card edited in place. Tapping the current one just shows the toast again.
- Time is shown in Asia/Ho_Chi_Minh.

### Lists

```
📋 All · 13 leads
[ New ] [ Contacted ] [ Trial ]
[ Enrolled ] [ Lost ] [ ✓ All ]
[ 🟡 Linh · YL · 2h ]
[ 🔵 Minh · IELTS · 1d ]
... up to 6 ...
[ ◀︎ ] [ 2/3 ] [ ▶︎ ]
```

Everything (tabs, paging) edits the same message. `YL` is the programme's initials (single word: first 6 letters). /today and search results have no tabs but add a "📋 All" button.

Opening a lead edits the list message into the lead card (single message, no chat clutter); "⬅️ Back to list" edits it back to the same filter and page. Card buttons carry that context. Search results are the exception: Back opens the All list because a query does not fit in 64 bytes of callback data.

### Stats

```
📊 Stats · This month (Oct 2026)
👥 Leads: 12 · ▲ +4 vs previous month
🎓 Conversion: 25% (3/12) · was 18%
⏱ Avg first response: 2h 5m (7)
By status ... By programme ... By language
[ ✓ This month ] [ Last month ] [ All time ]
```

Average first response = submission to first status change, only for leads that have status history (created after the Apps Script update). Shows "—" until there is data.

### Search and notes

- 🔎 Search: bot sends "🔎 Send a name or phone number" with ForceReply; your reply opens a result list. Name search ignores case and Vietnamese accents; phone search matches any digits (0912 or 912 both work).
- 📝 Add note: toast "Send your note as a reply", then a ForceReply prompt. Your reply is saved to the Sheet with a timestamp, the original card is refreshed, the prompt is deleted, and the bot confirms. The small `ref ...` line in the prompt tells the bot which lead the reply is for; do not edit it.

## Callback map (all <= 64 bytes, parsed defensively)

| Data | Meaning |
| --- | --- |
| `l:<filter>:<page>` | List. filter = new, contacted, trial, enrolled, lost, all, today |
| `l:q:<page>:<query>` | Search results page (query trimmed to fit) |
| `v:<id>:<ctx>` | Open lead card |
| `s:<id>:<code>:<ctx>` | Set status. code = n, c, t, e, l |
| `a:<id>:<ctx>` | Add note |
| `m:<t|p|a>` | Stats period: this month, last month, all time |
| `x` | No-op (page indicator) |

`ctx` = list filter letter (n c t e l a d) + page, e.g. `c2`. Legacy `s:<code>:<id>` from old notifications still works.

## Reliability

- Secret header checked in constant time; wrong or missing = 401.
- Admin check on every update (message chat and sender; callback sender and chat). Non-admins get the refusal only.
- The route returns 200 immediately and processes in `after()`; errors are logged (no personal data) and shown to the admin, never thrown. Telegram 429 is retried once if `retry_after` is 5 s or less.
- Every callback query is answered. Sheet failures show an alert instead of a silent spinner.

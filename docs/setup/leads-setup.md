# Lead capture setup (Google Sheet + Telegram + Turnstile)

This guide is written for the site owner. No coding is needed, only copy and paste.
Every part is optional and the site keeps working without it. The contact form
always works as long as at least ONE of these is set up: the Google Sheet,
email (Resend), or the Telegram bot. If none is set up, the form tells the
visitor to message you on Zalo instead.

What you will end up with:

- Every enquiry saved as a row in a Google Sheet.
- A Telegram bot with a menu: a card for every enquiry, status buttons,
  notes, lists, search and monthly stats.
- Free spam protection (Cloudflare Turnstile).

You will collect these values and paste them into Vercel at the end:

| Name | What it is |
| --- | --- |
| `LEADS_SHEET_WEBHOOK_URL` | Web app link from Google (Part 1) |
| `LEADS_SHEET_SECRET` | A password you invent (Part 1) |
| `TELEGRAM_BOT_TOKEN` | Token from BotFather (Part 2) |
| `TELEGRAM_ADMIN_CHAT_IDS` | Your Telegram chat number (Part 2) |
| `TELEGRAM_WEBHOOK_SECRET` | A password you invent (Part 2) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public key from Cloudflare (Part 3) |
| `TURNSTILE_SECRET_KEY` | Secret key from Cloudflare (Part 3) |

Already in use: `RESEND_API_KEY` (email sending) and `CONTACT_NOTIFY_EMAIL`
(the address that receives enquiry emails; defaults to hello@teacherbek.com).

To invent a password, any long random text works, for example 40 random
letters and numbers. Do not use spaces. Keep them private.

---

## Part 1. Google Sheet

1. Go to https://sheets.google.com and create a new blank spreadsheet. Name it
   "Teacher Bek Leads". You do not need to type anything in it.
2. In the menu choose **Extensions > Apps Script**. A code editor opens.
3. Delete everything in the editor. Open the file `docs/setup/google-apps-script.gs`
   from this project, copy ALL of it, and paste it in.
4. Near the top, find the line `var SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';`
   and replace the text between the quotes with your invented password
   (this is `LEADS_SHEET_SECRET`). Write it down.
5. Click the disk icon (Save).
6. Click **Deploy > New deployment**. Click the gear icon next to "Select type"
   and choose **Web app**.
7. Set:
   - Description: Leads
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy**. Google asks for permission: click **Authorize access**, pick
   your account, then **Advanced > Go to (project) (unsafe) > Allow**. This is
   normal for your own scripts.
9. Copy the **Web app URL** (it starts with `https://script.google.com/macros/s/`).
   This is `LEADS_SHEET_WEBHOOK_URL`.

The first lead creates a tab named **Leads** with the column headings
automatically.

### Updating the script later (keeps the same URL)

Do this whenever `docs/setup/google-apps-script.gs` changes (it did when the new
Telegram bot menu was added; the bot needs the new version for lists, search,
notes and stats):

1. Open the "Teacher Bek Leads" spreadsheet, then **Extensions > Apps Script**.
2. Click inside the code editor, press Ctrl+A (Cmd+A on Mac) and delete.
3. Paste the whole new `docs/setup/google-apps-script.gs`.
4. Change `var SECRET = '...'` to the SAME password you used before
   (`LEADS_SHEET_SECRET`). Click the disk icon (Save).
5. Click the blue **Deploy** button (top right), then **Manage deployments**.
6. Click the pencil icon (Edit) next to your existing Web app deployment.
7. Next to **Version**, open the drop-down and choose **New version**.
8. Leave "Execute as: Me" and "Who has access: Anyone" unchanged. Click **Deploy**
   and then **Done**.

Do NOT use "New deployment": that creates a different URL and the website would
stop reaching the Sheet. Existing rows keep working; two new columns, `notes`
and `history`, are added at the end of the heading row on the first change.

The "Anyone" access only means the link can be called. Without your secret
password the script refuses every request.

## Part 2. Telegram bot

1. In Telegram, search for **@BotFather** (blue tick) and open it.
2. Send `/newbot`. Choose a name (for example "Teacher Bek Leads") and a
   username ending in `bot` (for example `teacherbek_leads_bot`).
3. BotFather replies with a token like `123456789:AAH...`. This is
   `TELEGRAM_BOT_TOKEN`. Keep it private.
4. Open your new bot in Telegram and press **Start**, then send any message.
5. Find your chat number: search for **@userinfobot** in Telegram, press Start,
   and it replies with your **Id** (a number such as `123456789`). This is
   `TELEGRAM_ADMIN_CHAT_IDS`. To allow more people (for example an assistant),
   separate numbers with commas: `123456789,987654321`. Each of them must also
   press Start on your bot. Only these people can use the bot.
6. Invent a password for `TELEGRAM_WEBHOOK_SECRET`. Use only letters, numbers,
   underscore and dash (Telegram rule).
7. Deploy the website to Vercel with the variables from the last section first.
   Then connect Telegram to the site. On a computer, open Terminal (Mac) or
   PowerShell and run this, replacing the two capital parts (keep the quotes):

   ```
   curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
     -d "url=https://teacherbek.com/api/telegram" \
     -d "secret_token=YOUR_WEBHOOK_SECRET" \
     -d 'allowed_updates=["message","callback_query"]'
   ```

   The reply should contain `"ok":true`. To check later:
   `curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"`.
8. Set up the bot menu and descriptions. In the project folder, with
   `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_IDS` in `.env.local` (or exported
   in the terminal), run:

   ```
   node scripts/telegram-setup.mjs
   ```

   It registers the commands for your chat, the menu button and the bot
   description (English and Vietnamese). It is safe to run again, and it never
   prints the token. Then send `/start` to the bot to get the menu keyboard.

The bot menu (bottom of the chat): **New, Leads, Stats, Search, Help**.

- **New** / `/new`: leads still waiting for a first contact.
- **Leads** / `/leads`: all leads with filter tabs (New, Contacted, Trial,
  Enrolled, Lost, All), 6 per page.
- `/today`: leads received today.
- **Stats** / `/stats`: this month vs last month, conversion, programmes,
  languages, average response time. Buttons switch This month / Last month / All time.
- **Search** / `/search`: send a name or phone number.

Every new enquiry arrives as a card: phone (tap to copy), Zalo and WhatsApp
buttons, status buttons (Contacted, Trial, Enrolled, Lost), and **Add note**.
Tapping a status updates the Google Sheet and the card itself. Full screen
descriptions are in `docs/telegram/bot-ux.md`.

## Part 3. Cloudflare Turnstile (spam protection)

1. Create a free account at https://dash.cloudflare.com and open **Turnstile**
   in the left menu.
2. Click **Add widget**. Name: Teacher Bek. Hostnames: add `teacherbek.com`
   and `www.teacherbek.com` (add `localhost` if you want to test on your
   computer). Widget mode: **Managed**.
3. Create. Copy the **Site Key** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and the
   **Secret Key** (`TURNSTILE_SECRET_KEY`).

Turnstile only switches on when both keys are set. Set both or neither.

## Part 4. Put the values into Vercel

1. Open https://vercel.com, choose the project, then **Settings > Environment
   Variables**.
2. For each name in the table at the top, click **Add**, paste the name and the
   value, and keep Production (and Preview if you want) ticked.
3. Go to **Deployments**, open the latest one, and choose **Redeploy**. Variables
   only take effect after a new deployment.
4. Now run the `setWebhook` command from Part 2 (step 7).

For testing on your own computer, put the same names in a file called
`.env.local` (copy `.env.local.example`) and restart `npm run dev`.

## Part 5. Test it

1. Open the website and submit the contact form with a test name and your own
   phone number.
2. Within a few seconds you should see: a new row in the Leads tab, a Telegram
   message with buttons, and an email.
3. Tap **Contacted** in Telegram. The card changes and the status
   column in the sheet changes to `contacted`.
4. Tap **Add note**, reply with some text, and check the card shows it.
5. Send `/stats` to the bot. You should see the counts.
6. Test the failure path: temporarily remove all three of the Sheet, email and
   Telegram variables in a preview deployment. The form should show a message
   with a "Message on Zalo" button, and the pricing prices must NOT appear.

If something does not arrive, open Vercel > project > **Logs** and search for
`[leads]`. Each line shows the lead id and which channel (sheet, email,
telegram) worked or failed. Personal details are never written to logs.

## Notes

- A lead counts as received when at least one channel (sheet, email, Telegram)
  succeeded. If one fails you still get the others, and the failure is logged.
- Rate limiting (3 submissions per minute per visitor) is kept in memory per
  server instance, so it resets when Vercel starts a new instance. It is a
  basic guard; Turnstile does the real spam work. A shared limiter (for example
  Upstash Redis) can be added later.
- Only requests coming from teacherbek.com, www.teacherbek.com, localhost and
  `*.vercel.app` previews are accepted by the form endpoints.
- The Sheet stores the visitor's consent text and time for contact-form leads.

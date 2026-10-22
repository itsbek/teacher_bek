# Phase 0 Owner Checklist

Follow these steps in order. For each step, send the developer what is listed under "Send back".

---

## 1. Vercel: check settings and plan

1. Go to https://vercel.com and log in.
2. Click your project (teacherbek).
3. Click **Settings** at the top.
4. Click **Environment Variables** in the left menu.
5. Check that these exist for **Production**:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Note: `RESEND_API_KEY` and `CONTACT_NOTIFY_EMAIL` are no longer used for leads (leads go to Google Sheets and Telegram only). You may delete them from Vercel.
6. Good: the variable is listed. Each shows a value (the value stays hidden, that is normal).
7. New ones are coming from Phase 0. Do not add them yet. See `docs/setup/leads-setup.md` for them:
   - `LEADS_SHEET_WEBHOOK_URL`, `LEADS_SHEET_SECRET`
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_IDS`, `TELEGRAM_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
8. Click **Settings** → **Billing** and find the plan name.
9. Good: you know if it says **Hobby** or **Pro**.
10. Note: Hobby is for non-commercial use under Vercel's terms. A paid teaching business should use Pro, which costs about $20 per month.

**Send back:** the "Production" variable names you see, and the plan name (Hobby or Pro).

---

## 2. Resend: no longer needed for leads

Leads no longer use email, so you can skip this step. The steps below only matter if you still use Resend for something else.

1. Go to https://resend.com and log in.
2. Click **Domains** in the left menu.
3. Find **teacherbek.com**.
4. Good: the status says **Verified**. The SPF and DKIM records show green.
5. Click **Emails** in the left menu.
6. Look at the last 10 emails.
7. Good: most show **Delivered**. If you see **Bounced** or **Failed**, note the date.

**Send back:** the domain status, and a screenshot or list of any failed emails.

---

## 3. Inbox: send a test email (optional)

1. Open your personal email (Gmail, Yahoo, or similar).
2. Write a new email to **hello@teacherbek.com**.
3. Subject: `Phase 0 inbox test`. Body: `Testing.`
4. Send it.
5. Wait 5 minutes. Check that it arrives in the inbox.
6. Good: it arrives in the inbox, not in spam.

**Send back:** "arrived" or "not arrived", and whether it was in spam.

---

## 4. After the developer deploys Phase 0: test the forms

Do this once for each language.

1. Open each page:
   - https://teacherbek.com/vi
   - https://teacherbek.com/en
   - https://teacherbek.com/zh
   - https://teacherbek.com/ru
2. Scroll to the contact form.
3. Fill in:
   - Name: `TEST – delete`
   - Fill the other fields with fake but valid data.
4. Submit the form.
5. Check where the lead should arrive:
   - A Telegram message
   - A new row in the Google Sheet
6. Good: each language sends a lead to Telegram and the Sheet. The form shows a thank-you message.
7. Delete the test rows and messages after you check them.

**Send back:** for each language (vi, en, zh, ru), write "Telegram yes/no, Sheet yes/no". Also write any error message you saw.

---

## 5. Semrush: re-run the site audit

1. Go to https://www.semrush.com and log in.
2. Click **Projects** in the left menu.
3. Click **teacherbek.com**.
4. Click **Site Audit**.
5. Click **Rerun campaign**. Wait until it finishes (this can take 10 to 30 minutes).
6. Click **Export** → **PDF**.
7. Save the PDF file to the project folder root. The file name should be similar to `Semrush-Site_Audit__Full_Report-teacherbek_com-<date>.pdf`.
8. Good: the new score is higher than the old score (the old report is in the same folder).

**Send back:** the new score, and a message saying the PDF is saved in the project folder.

---

## 6. Optional: create a free PageSpeed Insights API key

This lets the developer re-run speed tests. Without it, the tests may fail with a quota error.

1. Go to https://console.cloud.google.com and log in.
2. Click the project drop-down at the top. Choose an existing project or click **New Project**.
3. Click the menu (three lines) → **APIs & Services** → **Library**.
4. Search for **PageSpeed Insights API**. Click it, then click **Enable**.
5. Click **APIs & Services** → **Credentials**.
6. Click **+ Create Credentials** → **API key**.
7. Copy the key. Keep it private. Do not paste it in email or chat.
8. Good: the key appears under "API keys".

**Send back:** only the message "API key created". Share the key itself through the secure method you agreed with the developer (for example, a password manager), not in chat.

---

## Summary

When all steps are done, send the developer one message with:
- Step 1: variable names and plan name
- Step 2: domain status
- Step 3: inbox test result
- Step 4: form results for each language
- Step 5: new Semrush score
- Step 6: "key created" (yes or no)

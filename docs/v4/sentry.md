# Sentry setup (owner note)

Sentry tells you when something breaks, most importantly when a message from a parent fails to reach you. It only sends error reports, never form contents, phone numbers, cookies or IP addresses.

## 1. Create the project
1. Sign in at sentry.io, choose the EU data region.
2. Create Project, platform **Next.js**, name it `teacherbek`.
3. Copy the DSN (a link like `https://abc@o123.ingest.de.sentry.io/456`).

## 2. Add it to Vercel
Project, Settings, Environment Variables. Add the same DSN twice, for Production and Preview:
- `NEXT_PUBLIC_SENTRY_DSN` (browser errors)
- `SENTRY_DSN` (server and lead delivery errors)

Optional, for readable error locations: `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` (Sentry, Settings, Auth Tokens, create one with project:releases and org:read). Redeploy afterwards. With the DSNs empty the site sends nothing.

## 3. Turn off IP storage
Sentry, Project Settings, Security & Privacy, switch on **Prevent Storing of IP Addresses**. Also turn on **Data Scrubber** and **Use Default Scrubbers**.

## 4. Three alerts (Alerts, Create Alert, Issues)
1. **Lost lead (most important).** Condition: "A new event is captured" with filter `tags.area equals lead-delivery`; action: send email to you; frequency: every event. Also add the filter-free variant for the URL containing `/api/contact` if you want a second net.
2. **New issue in production.** Condition: "A new issue is created", filter `environment equals production`; action: email; frequency: once per issue.
3. **Spike.** Condition: "The issue is seen more than 10 times in 1 hour"; filter `environment equals production`; action: email.

## 5. Test
After deploying, open the site, then in the browser console run `setTimeout(() => { throw new Error('sentry test') })`. The error should appear in Sentry within a minute with the release and no personal data.

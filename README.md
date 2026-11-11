# GoalZone — free starter website

This starter turns the earlier static GoalZone mock-up into a Cloudflare Pages project with:
- API-Football live scores, upcoming fixtures and league standings via Pages Functions.
- BBC Sport football RSS headlines shown as headlines + links to the original BBC article.
- API key kept on the server in a Cloudflare Pages secret (never put it in index.html).

## 1. Get a free football API key
1. Create a free account at https://www.api-football.com/.
2. Open your dashboard and copy your API key.
3. The free plan currently lists 100 requests/day. Keep the site traffic modest and use the cache in the function.

## 2. Create the GitHub repository (recommended)
1. Sign in to https://github.com/ and create a new repository named `goalzone`.
2. Upload the contents of this folder. Important: upload `index.html`, `README.md`, and the `functions` folder (including `functions/api/matches.js` and `functions/api/news.js`).
3. Commit the files to the `main` branch.

## 3. Publish free with Cloudflare Pages
1. Sign in at https://dash.cloudflare.com/.
2. Open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Choose GitHub, authorize Cloudflare, and select `goalzone`.
4. Framework preset: **None**. Build command: leave blank. Build output directory: `/` (or `.` if the dashboard requests a relative path).
5. Choose **Save and Deploy**. Your site receives a free `*.pages.dev` address.

## 4. Add the API key securely
1. In Cloudflare, open **Workers & Pages** → your GoalZone Pages project.
2. Open **Settings** → **Variables and Secrets** → **Add**.
3. Name: `API_FOOTBALL_KEY`.
4. Paste your API-Football key as the value, choose **Encrypt** / Secret, then Save.
5. Trigger a new deployment (Deployments → Retry deployment, or make a small GitHub commit).

## 5. Test the site
Open your `*.pages.dev` address on your phone.
- `/api/matches?mode=live` should return JSON (possibly an empty list if no matches are live).
- `/api/matches?mode=upcoming&league=39` should return Premier League fixtures.
- `/api/matches?mode=standings&league=39&season=2026` should return the table if that season is covered.
- `/api/news` should return BBC Sport football headlines with links.

## Notes / limitations
- The API-Football free plan lists 100 requests/day; this is a starter for low traffic, not unlimited commercial-scale live scores.
- League season coverage varies. If a table is empty, check the provider's coverage and select the correct season year.
- Kenya's FKF Premier League is included in the provider coverage list, but season/endpoint availability can vary. Verify it in your API dashboard before relying on it.
- BBC RSS is used for headline links only. Users open the original BBC story. Do not copy full articles or images into GoalZone. Review the publisher's feed terms before monetizing or changing how you display content.
- Club crests, competition logos and photographs may have separate rights. Use text/initials until you have permission or a suitable licence.
- The free `pages.dev` address is enough to launch. A custom domain is optional and usually costs money, so skip it for now.

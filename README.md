# GoalZone — free football website

GoalZone is a mobile-friendly football website. It uses Cloudflare Pages Functions for server-side API requests.

## What is included
- Live scores, upcoming fixtures and league standings from API-Football.
- BBC Sport football RSS headlines linking to the original publisher.
- API key stored as a Cloudflare Pages secret, not in browser JavaScript.

## 1. Create a free API-Football key
1. Register at https://www.api-football.com/.
2. Open your API-Football dashboard and copy your API key.
3. The published Free plan currently lists 100 requests per day. Avoid frequent manual refreshes.

## 2. Deploy this existing repository to Cloudflare Pages
GitHub Pages can host the static HTML but cannot run the `functions/api/` server-side routes. Use Cloudflare Pages for the live-data version.

1. Sign in at https://dash.cloudflare.com/.
2. Open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Connect GitHub and choose the existing repository **xindaniwise-maker/Goal**.
4. Set the production branch to `main`.
5. Framework preset: **None**. Build command: leave blank. Build output directory: `/` (if rejected, use `.`).
6. Click **Save and Deploy**.

## 3. Add the API key as a secret
1. Open the new GoalZone project in Cloudflare.
2. Go to **Settings** → **Variables and Secrets**.
3. Add a secret named `API_FOOTBALL_KEY`.
4. Paste the API-Football key as the value and save it as an encrypted/secret value.
5. Redeploy the project so the function receives the secret.

Never paste the API key into `index.html`, a public GitHub file, or a chat message.

## 4. Test the endpoints
Replace `YOUR-PROJECT.pages.dev` with the Pages address Cloudflare gives you:
- `/api/matches?mode=live`
- `/api/matches?mode=upcoming&league=39` (Premier League)
- `/api/matches?mode=standings&league=39&season=2026`
- `/api/news`

An empty live-score list can simply mean no covered matches are currently live. Competition and season coverage depends on the API-Football plan.

## Notes
- API-Football Free currently lists 100 requests/day. The functions cache responses to help conserve the quota.
- The current frontend has a Kenyan Premier League selector, but its provider league ID/season must be confirmed in your API-Football dashboard before that filter can return data.
- BBC RSS is used for headlines and links only. Readers open the original BBC story; GoalZone does not republish full articles.
- Club crests, competition logos and photographs may have separate rights. Use text/initials unless you have permission or a suitable licence.
- A free `pages.dev` address is sufficient; a custom domain is optional.

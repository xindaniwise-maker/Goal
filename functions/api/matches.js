const API_BASE = "https://v3.football.api-sports.io";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}

function validNumber(value) {
  return /^\d+$/.test(value || "");
}

export async function onRequestGet({ request, env }) {
  if (!env.API_FOOTBALL_KEY) {
    return json({
      error: "Football API is not configured yet. In Cloudflare Pages, open Settings → Variables and Secrets → Add, then create an encrypted secret named API_FOOTBALL_KEY."
    }, 503);
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "live";
  const league = url.searchParams.get("league");
  const season = url.searchParams.get("season") || String(new Date().getUTCFullYear());

  let endpoint;
  const now = new Date();

  if (mode === "live") {
    endpoint = "/fixtures?live=all";
  } else if (mode === "upcoming") {
    const from = now.toISOString().slice(0, 10);
    const toDate = new Date(now);
    toDate.setUTCDate(toDate.getUTCDate() + 7);
    const to = toDate.toISOString().slice(0, 10);
    endpoint = `/fixtures?from=${from}&to=${to}&timezone=Africa/Nairobi`;
    if (league && validNumber(league)) endpoint += `&league=${league}&season=${season}`;
    else if (league) return json({ error: "This competition needs a numeric API-Football league ID. The selected competition may not be covered by your plan." }, 400);
  } else if (mode === "standings") {
    if (!validNumber(league)) {
      return json({ error: "Choose a supported competition with a numeric league ID before loading standings." }, 400);
    }
    if (!/^\d{4}$/.test(season)) return json({ error: "Season must be a four-digit year, for example 2026." }, 400);
    endpoint = `/standings?league=${league}&season=${season}`;
  } else {
    return json({ error: "Unknown mode. Use live, upcoming, or standings." }, 400);
  }

  try {
    const response = await fetch(API_BASE + endpoint, {
      headers: { "x-apisports-key": env.API_FOOTBALL_KEY },
      cf: { cacheTtl: mode === "live" ? 30 : 900, cacheEverything: true }
    });
    const body = await response.json();

    if (!response.ok || (body.errors && Object.keys(body.errors).length)) {
      return json({
        error: "The football data provider returned an error. Check that your API key is valid and that your plan covers this competition.",
        details: body.errors || body.message || response.statusText
      }, response.status >= 400 ? response.status : 502);
    }
    return json(body);
  } catch (error) {
    return json({ error: "Could not reach the football data provider. Please try again later." }, 502);
  }
}

const FEED_URL = "https://feeds.bbci.co.uk/sport/football/rss.xml";

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function tag(item, name) {
  const match = item.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

export async function onRequestGet() {
  try {
    const response = await fetch(FEED_URL, {
      headers: { "user-agent": "GoalZone football headlines reader" },
      cf: { cacheTtl: 1800, cacheEverything: true }
    });
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "The BBC Sport news feed is temporarily unavailable." }), {
        status: 502,
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    const xml = await response.text();
    const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
      .slice(0, 12)
      .map(match => {
        const item = match[1];
        return {
          title: tag(item, "title").replace(/<[^>]*>/g, ""),
          url: tag(item, "link"),
          date: tag(item, "pubDate"),
          source: "BBC Sport"
        };
      })
      .filter(item => item.title && /^https:\/\//i.test(item.url));

    return new Response(JSON.stringify({ items }), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=1800"
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not load BBC Sport headlines. Please try again later." }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
}

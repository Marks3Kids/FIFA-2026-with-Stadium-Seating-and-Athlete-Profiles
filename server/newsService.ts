import Parser from "rss-parser";
import { db } from "../db";
import { newsItems } from "@shared/schema";
import { desc } from "drizzle-orm";

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'ChampionshipConcierge/1.0',
  },
});

interface RSSFeedConfig {
  url: string;
  source: string;
  category: string;
}

const RSS_FEEDS: RSSFeedConfig[] = [
  {
    url: "https://www.espn.com/espn/rss/soccer/news",
    source: "ESPN",
    category: "Soccer",
  },
  {
    url: "http://feeds.bbci.co.uk/sport/football/rss.xml",
    source: "BBC Sport",
    category: "Football",
  },
  {
    url: "https://www.skysports.com/rss/11095",
    source: "Sky Sports",
    category: "Football",
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}

function extractCategory(item: any, defaultCategory: string): string {
  if (item.categories && item.categories.length > 0) {
    const cat = item.categories[0];
    if (typeof cat === 'string') return cat;
    if (cat._ || cat.name) return cat._ || cat.name;
  }
  return defaultCategory;
}

function cleanDescription(desc: string | undefined): string {
  if (!desc) return "";
  return desc
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
    .substring(0, 300);
}

export async function fetchAndStoreNews(): Promise<void> {
  console.log("[News] Starting RSS feed fetch...");
  
  const allItems: Array<{
    title: string;
    category: string;
    time: string;
    link: string | null;
    description: string | null;
    source: string;
    publishedAt: Date;
  }> = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`[News] Fetching from ${feed.source}...`);
      const feedData = await parser.parseURL(feed.url);
      
      for (const item of feedData.items.slice(0, 5)) {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        allItems.push({
          title: item.title || "Untitled",
          category: extractCategory(item, feed.category),
          time: formatTimeAgo(pubDate),
          link: item.link || null,
          description: cleanDescription(item.contentSnippet || item.content || item.description),
          source: feed.source,
          publishedAt: pubDate,
        });
      }
      
      console.log(`[News] Fetched ${feedData.items.length} items from ${feed.source}`);
    } catch (error) {
      console.error(`[News] Error fetching from ${feed.source}:`, error);
    }
  }

  allItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const topItems = allItems.slice(0, 10);

  if (topItems.length > 0) {
    try {
      await db.delete(newsItems);
      
      for (const item of topItems) {
        await db.insert(newsItems).values({
          title: item.title,
          category: item.category,
          time: item.time,
          link: item.link,
          description: item.description,
          source: item.source,
          publishedAt: item.publishedAt,
        });
      }
      
      console.log(`[News] Stored ${topItems.length} news items`);
    } catch (error) {
      console.error("[News] Error storing news items:", error);
    }
  }
}

export async function getLatestNews(limit: number = 3): Promise<typeof newsItems.$inferSelect[]> {
  try {
    const items = await db
      .select()
      .from(newsItems)
      .orderBy(desc(newsItems.publishedAt))
      .limit(limit);
    
    return items;
  } catch (error) {
    console.error("[News] Error fetching news from database:", error);
    return [];
  }
}

let lastFetchTime: number = 0;
const FETCH_INTERVAL = 4 * 60 * 60 * 1000;

export async function getNewsWithAutoRefresh(limit: number = 3): Promise<typeof newsItems.$inferSelect[]> {
  const now = Date.now();
  
  if (now - lastFetchTime > FETCH_INTERVAL) {
    await fetchAndStoreNews();
    lastFetchTime = now;
  }
  
  return getLatestNews(limit);
}

export async function refreshNewsNow(): Promise<void> {
  await fetchAndStoreNews();
  lastFetchTime = Date.now();
}

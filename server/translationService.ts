import OpenAI from "openai";
import { db } from "../db";
import { newsItems, knockoutBrackets, matches } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { KnockoutBracket, Match } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SUPPORTED_LOCALES = ["es", "fr", "de", "pt", "ar", "ja", "it", "nl"];

const LOCALE_NAMES: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  ar: "Arabic",
  ja: "Japanese",
  it: "Italian",
  nl: "Dutch",
};

interface TranslationResult {
  title: string;
  description?: string;
}

export async function translateNewsItem(
  newsId: number,
  title: string,
  description: string | null,
  targetLocale: string
): Promise<TranslationResult> {
  if (!SUPPORTED_LOCALES.includes(targetLocale)) {
    return { title, description: description || undefined };
  }

  const languageName = LOCALE_NAMES[targetLocale];
  
  try {
    const prompt = description 
      ? `Translate the following soccer news headline and description to ${languageName}. Return only JSON with "title" and "description" fields, no explanation.

Title: ${title}
Description: ${description}`
      : `Translate the following soccer news headline to ${languageName}. Return only JSON with a "title" field, no explanation.

Title: ${title}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional translator specializing in sports news. Translate accurately while maintaining the journalistic tone. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("[Translation] No content in response");
      return { title, description: description || undefined };
    }

    const parsed = JSON.parse(content) as TranslationResult;
    
    await cacheTranslation(newsId, targetLocale, parsed);
    
    return parsed;
  } catch (error) {
    console.error(`[Translation] Error translating to ${targetLocale}:`, error);
    return { title, description: description || undefined };
  }
}

async function cacheTranslation(
  newsId: number,
  locale: string,
  translation: TranslationResult
): Promise<void> {
  try {
    const [existing] = await db
      .select({ translations: newsItems.translations })
      .from(newsItems)
      .where(eq(newsItems.id, newsId));

    const currentTranslations = existing?.translations || {};
    const updatedTranslations = {
      ...currentTranslations,
      [locale]: translation,
    };

    await db
      .update(newsItems)
      .set({ translations: updatedTranslations })
      .where(eq(newsItems.id, newsId));

    console.log(`[Translation] Cached ${locale} translation for news #${newsId}`);
  } catch (error) {
    console.error(`[Translation] Error caching translation:`, error);
  }
}

export async function getTranslatedNews(
  news: Array<{
    id: number;
    title: string;
    description: string | null;
    translations: Record<string, TranslationResult> | null;
    [key: string]: any;
  }>,
  locale: string
): Promise<Array<any>> {
  if (locale === "en" || !SUPPORTED_LOCALES.includes(locale)) {
    return news;
  }

  const translatedNews = await Promise.all(
    news.map(async (item) => {
      const cachedTranslation = item.translations?.[locale];
      
      if (cachedTranslation) {
        return {
          ...item,
          title: cachedTranslation.title,
          description: cachedTranslation.description || item.description,
          originalTitle: item.title,
          isTranslated: true,
        };
      }

      const translation = await translateNewsItem(
        item.id,
        item.title,
        item.description,
        locale
      );

      return {
        ...item,
        title: translation.title,
        description: translation.description || item.description,
        originalTitle: item.title,
        isTranslated: translation.title !== item.title,
      };
    })
  );

  return translatedNews;
}

interface BracketTranslationResult {
  team1Slot: string;
  team2Slot: string;
  stadium?: string;
  city?: string;
}

async function translateBracketSlots(
  bracketId: number,
  team1Slot: string,
  team2Slot: string,
  stadium: string,
  city: string,
  targetLocale: string
): Promise<BracketTranslationResult> {
  if (!SUPPORTED_LOCALES.includes(targetLocale)) {
    return { team1Slot, team2Slot, stadium, city };
  }

  const languageName = LOCALE_NAMES[targetLocale];

  try {
    const prompt = `Translate the following World Cup bracket information to ${languageName}. 
    
For team slots, translate the placeholder meaning (e.g., "Winner Group A" = the team that wins Group A).
For stadium names, keep the official name but you may add translated descriptors if needed.
For city names, use the localized version (e.g., "New York" stays as-is in most languages, but "Mexico City" becomes "Ciudad de México" in Spanish).

Return JSON with these fields: "team1Slot", "team2Slot", "stadium", "city"

team1Slot: ${team1Slot}
team2Slot: ${team2Slot}
stadium: ${stadium}
city: ${city}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional sports translator specializing in World Cup content. Translate accurately while keeping proper nouns recognizable. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { team1Slot, team2Slot, stadium, city };
    }

    const parsed = JSON.parse(content) as BracketTranslationResult;
    
    await cacheBracketTranslation(bracketId, targetLocale, parsed);
    
    return parsed;
  } catch (error) {
    console.error(`[Translation] Error translating bracket to ${targetLocale}:`, error);
    return { team1Slot, team2Slot, stadium, city };
  }
}

async function cacheBracketTranslation(
  bracketId: number,
  locale: string,
  translation: BracketTranslationResult
): Promise<void> {
  try {
    const [existing] = await db
      .select({ translations: knockoutBrackets.translations })
      .from(knockoutBrackets)
      .where(eq(knockoutBrackets.id, bracketId));

    const currentTranslations = existing?.translations || {};
    const updatedTranslations = {
      ...currentTranslations,
      [locale]: translation,
    };

    await db
      .update(knockoutBrackets)
      .set({ translations: updatedTranslations })
      .where(eq(knockoutBrackets.id, bracketId));

    console.log(`[Translation] Cached ${locale} translation for bracket #${bracketId}`);
  } catch (error) {
    console.error(`[Translation] Error caching bracket translation:`, error);
  }
}

export async function translateKnockoutBrackets(
  brackets: KnockoutBracket[],
  locale: string
): Promise<KnockoutBracket[]> {
  if (locale === "en" || !SUPPORTED_LOCALES.includes(locale)) {
    return brackets;
  }

  const translatedBrackets = await Promise.all(
    brackets.map(async (bracket) => {
      const cachedTranslation = bracket.translations?.[locale];
      
      if (cachedTranslation) {
        return {
          ...bracket,
          team1Slot: cachedTranslation.team1Slot,
          team2Slot: cachedTranslation.team2Slot,
          stadium: cachedTranslation.stadium || bracket.stadium,
          city: cachedTranslation.city || bracket.city,
        };
      }

      const translation = await translateBracketSlots(
        bracket.id,
        bracket.team1Slot,
        bracket.team2Slot,
        bracket.stadium,
        bracket.city,
        locale
      );

      return {
        ...bracket,
        team1Slot: translation.team1Slot,
        team2Slot: translation.team2Slot,
        stadium: translation.stadium || bracket.stadium,
        city: translation.city || bracket.city,
      };
    })
  );

  return translatedBrackets;
}

// Match Translation Functions
interface MatchTranslationResult {
  team1?: string;
  team2?: string;
  city?: string;
}

function needsTranslation(teamName: string): boolean {
  const placeholderPatterns = [
    /Winner/i,
    /Playoff/i,
    /Play-off/i,
    /Runner-up/i,
    /TBD/i,
    /UEFA/i,
    /CAF/i,
    /AFC/i,
    /CONCACAF/i,
    /CONMEBOL/i,
    /OFC/i,
  ];
  return placeholderPatterns.some(pattern => pattern.test(teamName));
}

async function translateMatchTeams(
  matchId: number,
  team1: string,
  team2: string,
  city: string,
  targetLocale: string
): Promise<MatchTranslationResult> {
  if (!SUPPORTED_LOCALES.includes(targetLocale)) {
    return { team1, team2, city };
  }

  const team1NeedsTranslation = needsTranslation(team1);
  const team2NeedsTranslation = needsTranslation(team2);
  
  if (!team1NeedsTranslation && !team2NeedsTranslation) {
    return { team1, team2, city };
  }

  const languageName = LOCALE_NAMES[targetLocale];

  try {
    const prompt = `Translate the following World Cup match information to ${languageName}. 

For team names that are placeholders (like "UEFA Playoff D Winner", "Winner Group A"), translate the meaning.
For actual country names, keep them in the original language or use the standard localized version.
For city names, use the localized version (e.g., "Mexico City" becomes "Ciudad de México" in Spanish).

Return JSON with these fields: "team1", "team2", "city"

team1: ${team1}
team2: ${team2}
city: ${city}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional sports translator specializing in World Cup content. Translate placeholder team names accurately while keeping actual country names recognizable. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { team1, team2, city };
    }

    const parsed = JSON.parse(content) as MatchTranslationResult;
    
    await cacheMatchTranslation(matchId, targetLocale, parsed);
    
    return parsed;
  } catch (error) {
    console.error(`[Translation] Error translating match to ${targetLocale}:`, error);
    return { team1, team2, city };
  }
}

async function cacheMatchTranslation(
  matchId: number,
  locale: string,
  translation: MatchTranslationResult
): Promise<void> {
  try {
    const [existing] = await db
      .select({ translations: matches.translations })
      .from(matches)
      .where(eq(matches.id, matchId));

    const currentTranslations = existing?.translations || {};
    const updatedTranslations = {
      ...currentTranslations,
      [locale]: translation,
    };

    await db
      .update(matches)
      .set({ translations: updatedTranslations })
      .where(eq(matches.id, matchId));

    console.log(`[Translation] Cached ${locale} translation for match #${matchId}`);
  } catch (error) {
    console.error(`[Translation] Error caching match translation:`, error);
  }
}

export async function translateMatches(
  matchList: Match[],
  locale: string
): Promise<Match[]> {
  if (locale === "en" || !SUPPORTED_LOCALES.includes(locale)) {
    return matchList;
  }

  const translatedMatches = await Promise.all(
    matchList.map(async (match) => {
      const cachedTranslation = match.translations?.[locale];
      
      if (cachedTranslation) {
        return {
          ...match,
          team1: cachedTranslation.team1 || match.team1,
          team2: cachedTranslation.team2 || match.team2,
          city: cachedTranslation.city || match.city,
        };
      }

      if (!needsTranslation(match.team1) && !needsTranslation(match.team2)) {
        return match;
      }

      const translation = await translateMatchTeams(
        match.id,
        match.team1,
        match.team2,
        match.city,
        locale
      );

      return {
        ...match,
        team1: translation.team1 || match.team1,
        team2: translation.team2 || match.team2,
        city: translation.city || match.city,
      };
    })
  );

  return translatedMatches;
}

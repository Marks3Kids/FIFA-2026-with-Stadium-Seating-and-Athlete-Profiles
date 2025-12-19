import OpenAI from "openai";
import { db } from "../db";
import { newsItems } from "@shared/schema";
import { eq } from "drizzle-orm";

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

import { db } from "../db";
import { aiMessageUsage, aiMessagePackPurchases } from "../shared/schema";
import { eq, and } from "drizzle-orm";

const MONTHLY_MESSAGE_LIMIT = 50;
const MESSAGES_PER_PACK = 50;
export const MESSAGE_PACK_PRODUCT_ID = "prod_TkdvusZSj18Mlv";

function getCurrentMonthYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function getMessageUsage(email: string): Promise<{
  messagesUsed: number;
  bonusMessages: number;
  totalAvailable: number;
  remaining: number;
  monthYear: string;
}> {
  const monthYear = getCurrentMonthYear();
  
  const [usage] = await db
    .select()
    .from(aiMessageUsage)
    .where(and(eq(aiMessageUsage.email, email), eq(aiMessageUsage.monthYear, monthYear)));

  if (!usage) {
    return {
      messagesUsed: 0,
      bonusMessages: 0,
      totalAvailable: MONTHLY_MESSAGE_LIMIT,
      remaining: MONTHLY_MESSAGE_LIMIT,
      monthYear,
    };
  }

  const totalAvailable = MONTHLY_MESSAGE_LIMIT + usage.bonusMessages;
  const remaining = Math.max(0, totalAvailable - usage.messagesUsed);

  return {
    messagesUsed: usage.messagesUsed,
    bonusMessages: usage.bonusMessages,
    totalAvailable,
    remaining,
    monthYear,
  };
}

export async function incrementMessageCount(email: string): Promise<{
  success: boolean;
  remaining: number;
  error?: string;
}> {
  const monthYear = getCurrentMonthYear();
  
  const [existing] = await db
    .select()
    .from(aiMessageUsage)
    .where(and(eq(aiMessageUsage.email, email), eq(aiMessageUsage.monthYear, monthYear)));

  if (!existing) {
    await db.insert(aiMessageUsage).values({
      email,
      monthYear,
      messagesUsed: 1,
      bonusMessages: 0,
    });
    return { success: true, remaining: MONTHLY_MESSAGE_LIMIT - 1 };
  }

  const totalAvailable = MONTHLY_MESSAGE_LIMIT + existing.bonusMessages;
  
  if (existing.messagesUsed >= totalAvailable) {
    return {
      success: false,
      remaining: 0,
      error: "Message limit reached. Purchase additional messages to continue.",
    };
  }

  await db
    .update(aiMessageUsage)
    .set({
      messagesUsed: existing.messagesUsed + 1,
      updatedAt: new Date(),
    })
    .where(eq(aiMessageUsage.id, existing.id));

  const remaining = totalAvailable - existing.messagesUsed - 1;
  return { success: true, remaining };
}

export async function canSendMessage(email: string): Promise<boolean> {
  const usage = await getMessageUsage(email);
  return usage.remaining > 0;
}

export async function isSessionAlreadyUsed(sessionId: string): Promise<boolean> {
  const [existingPurchase] = await db
    .select()
    .from(aiMessagePackPurchases)
    .where(eq(aiMessagePackPurchases.stripeSessionId, sessionId));
  
  return !!existingPurchase;
}

export async function addBonusMessages(
  email: string,
  messages: number = MESSAGES_PER_PACK,
  stripeSessionId?: string
): Promise<{ success: boolean; alreadyProcessed?: boolean }> {
  const monthYear = getCurrentMonthYear();
  
  if (stripeSessionId) {
    const [existingPurchase] = await db
      .select()
      .from(aiMessagePackPurchases)
      .where(eq(aiMessagePackPurchases.stripeSessionId, stripeSessionId));
    
    if (existingPurchase) {
      return { success: true, alreadyProcessed: true };
    }
  }
  
  await db.insert(aiMessagePackPurchases).values({
    email,
    messagesAdded: messages,
    stripeSessionId,
  });

  const [existing] = await db
    .select()
    .from(aiMessageUsage)
    .where(and(eq(aiMessageUsage.email, email), eq(aiMessageUsage.monthYear, monthYear)));

  if (!existing) {
    await db.insert(aiMessageUsage).values({
      email,
      monthYear,
      messagesUsed: 0,
      bonusMessages: messages,
    });
  } else {
    await db
      .update(aiMessageUsage)
      .set({
        bonusMessages: existing.bonusMessages + messages,
        updatedAt: new Date(),
      })
      .where(eq(aiMessageUsage.id, existing.id));
  }
  
  return { success: true, alreadyProcessed: false };
}

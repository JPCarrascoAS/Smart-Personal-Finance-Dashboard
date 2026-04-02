"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getGroqClient } from "@/lib/groq";
import { subMonths, format } from "date-fns";
import type { InsightData } from "@/types/index";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getInsights(): Promise<InsightData[]> {
  const userId = await getUserId();

  const insights = await prisma.insight.findMany({
    where: { userId },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 10,
  });

  return insights;
}

export async function generateInsights(): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId();
  const groq = getGroqClient();

  if (!groq) {
    return { success: false, error: "Groq API key not configured. Add GROQ_API_KEY to your .env file." };
  }

  const sixMonthsAgo = subMonths(new Date(), 6);
  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: sixMonthsAgo } },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  if (transactions.length < 3) {
    return { success: false, error: "Need at least 3 transactions to generate insights. Add more transactions first." };
  }

  const monthlyData = new Map<string, { income: number; expenses: number; categories: Map<string, number> }>();
  for (const t of transactions) {
    const month = format(t.date, "yyyy-MM");
    if (!monthlyData.has(month)) {
      monthlyData.set(month, { income: 0, expenses: 0, categories: new Map() });
    }
    const data = monthlyData.get(month)!;
    const amount = Number(t.amount);
    if (t.type === "INCOME") {
      data.income += amount;
    } else {
      data.expenses += amount;
      const catAmount = data.categories.get(t.category.name) || 0;
      data.categories.set(t.category.name, catAmount + amount);
    }
  }

  const summary = Array.from(monthlyData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      income: data.income.toFixed(2),
      expenses: data.expenses.toFixed(2),
      savings: (data.income - data.expenses).toFixed(2),
      topCategories: Array.from(data.categories.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, amount]) => `${name}: $${amount.toFixed(2)}`),
    }));

  const prompt = `You are a personal finance advisor AI. Analyze this user's financial data and provide actionable insights.

Monthly Financial Summary (last 6 months):
${JSON.stringify(summary, null, 2)}

Total transactions: ${transactions.length}

Provide exactly 4 insights in this JSON array format (no markdown, no code fences, just the raw JSON array):
[
  {
    "type": "SPENDING_PATTERN" | "ANOMALY" | "SAVING_TIP" | "BUDGET",
    "title": "Short title (max 60 chars)",
    "content": "Detailed actionable insight (2-3 sentences, be specific with numbers)",
    "priority": 1-10
  }
]

Include:
1. One SPENDING_PATTERN insight about their top spending categories
2. One ANOMALY insight about unusual changes month-over-month
3. One SAVING_TIP with a concrete suggestion
4. One BUDGET recommendation`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return { success: false, error: "No response from AI" };

    const parsed = JSON.parse(content) as Array<{
      type: string;
      title: string;
      content: string;
      priority: number;
    }>;

    await prisma.insight.deleteMany({ where: { userId } });
    await prisma.insight.createMany({
      data: parsed.map((insight) => ({
        type: insight.type as "SPENDING_PATTERN" | "ANOMALY" | "SAVING_TIP" | "BUDGET",
        title: insight.title,
        content: insight.content,
        priority: insight.priority,
        userId,
      })),
    });

    return { success: true };
  } catch (e) {
    console.error("AI insight generation failed:", e);
    return { success: false, error: "Failed to generate insights. Please try again." };
  }
}

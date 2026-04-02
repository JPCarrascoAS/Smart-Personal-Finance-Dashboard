"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import type { DashboardData } from "@/types/index";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getDashboardData(): Promise<DashboardData> {
  const userId = await getUserId();
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    currentMonthTxns,
    prevMonthTxns,
    allTxns,
    recentTxns,
  ] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: subMonths(now, 6) },
      },
      include: { category: true },
      orderBy: { date: "asc" },
    }),
    prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      take: 8,
    }),
  ]);

  const monthlyIncome = currentMonthTxns
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = currentMonthTxns
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevIncome = prevMonthTxns
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevExpenses = prevMonthTxns
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalBalance = allTxns.reduce((sum, t) => {
    const amount = Number(t.amount);
    return t.type === "INCOME" ? sum + amount : sum - amount;
  }, 0);

  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

  const incomeChange =
    prevIncome > 0
      ? ((monthlyIncome - prevIncome) / prevIncome) * 100
      : monthlyIncome > 0
      ? 100
      : 0;

  const expenseChange =
    prevExpenses > 0
      ? ((monthlyExpenses - prevExpenses) / prevExpenses) * 100
      : monthlyExpenses > 0
      ? 100
      : 0;

  // Monthly trends (last 6 months)
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthTxns = allTxns.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );
    const income = monthTxns
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenses = monthTxns
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + Number(t.amount), 0);

    monthlyTrends.push({
      month: format(monthDate, "MMM"),
      income,
      expenses,
      savings: income - expenses,
    });
  }

  // Category breakdown (current month expenses)
  const categoryMap = new Map<string, { name: string; amount: number; color: string }>();
  const currentExpenses = allTxns.filter(
    (t) =>
      t.type === "EXPENSE" &&
      t.date >= currentMonthStart &&
      t.date <= currentMonthEnd
  );

  for (const t of currentExpenses) {
    const key = t.categoryId;
    const existing = categoryMap.get(key);
    if (existing) {
      existing.amount += Number(t.amount);
    } else {
      categoryMap.set(key, {
        name: t.category.name,
        amount: Number(t.amount),
        color: t.category.color || "#6366f1",
      });
    }
  }

  const totalCategoryAmount = Array.from(categoryMap.values()).reduce(
    (s, c) => s + c.amount,
    0
  );

  const categoryBreakdown = Array.from(categoryMap.values())
    .map((c) => ({
      ...c,
      percentage:
        totalCategoryAmount > 0
          ? (c.amount / totalCategoryAmount) * 100
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    incomeChange,
    expenseChange,
    monthlyTrends,
    categoryBreakdown,
    recentTransactions: recentTxns.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
  };
}

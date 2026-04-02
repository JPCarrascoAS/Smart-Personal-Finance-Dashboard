"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  incomeChange: number;
  expenseChange: number;
}

export function SummaryCards({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  savingsRate,
  incomeChange,
  expenseChange,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(totalBalance),
      icon: Wallet,
      iconBg: "from-accent to-purple-500",
      change: null,
    },
    {
      label: "Monthly Income",
      value: formatCurrency(monthlyIncome),
      icon: TrendingUp,
      iconBg: "from-income to-emerald-400",
      change: incomeChange,
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(monthlyExpenses),
      icon: TrendingDown,
      iconBg: "from-expense to-rose-400",
      change: expenseChange,
    },
    {
      label: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      iconBg: "from-warning to-amber-400",
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              {card.change !== null && (
                <p
                  className={`text-xs mt-1.5 ${
                    card.change >= 0 ? "text-income" : "text-expense"
                  }`}
                >
                  {card.change >= 0 ? "+" : ""}
                  {card.change.toFixed(1)}% from last month
                </p>
              )}
            </div>
            <div
              className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shrink-0`}
            >
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

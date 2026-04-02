export type TransactionType = "INCOME" | "EXPENSE";
export type InsightType = "SPENDING_PATTERN" | "ANOMALY" | "SAVING_TIP" | "BUDGET";

export interface TransactionWithCategory {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  tags: string[];
  notes: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  incomeChange: number;
  expenseChange: number;
  monthlyTrends: MonthlySummary[];
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: TransactionWithCategory[];
}

export interface InsightData {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  priority: number;
  createdAt: Date;
}

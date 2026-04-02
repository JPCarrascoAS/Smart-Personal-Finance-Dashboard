import { getDashboardData } from "@/actions/analytics";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import { CategoryChart } from "@/components/charts/category-chart";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Your financial overview at a glance
        </p>
      </div>

      <SummaryCards
        totalBalance={data.totalBalance}
        monthlyIncome={data.monthlyIncome}
        monthlyExpenses={data.monthlyExpenses}
        savingsRate={data.savingsRate}
        incomeChange={data.incomeChange}
        expenseChange={data.expenseChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={data.monthlyTrends} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart data={data.categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      <RecentTransactions transactions={data.recentTransactions} />
    </div>
  );
}

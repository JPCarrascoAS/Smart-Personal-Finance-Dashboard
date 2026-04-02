import { getInsights } from "@/actions/insights";
import { InsightsPanel } from "@/components/insights/insights-panel";

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
        <p className="text-sm text-muted mt-1">
          Smart analysis of your spending patterns and saving opportunities
        </p>
      </div>

      <InsightsPanel insights={insights} />
    </div>
  );
}

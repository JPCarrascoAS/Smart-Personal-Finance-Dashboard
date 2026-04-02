"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { generateInsights } from "@/actions/insights";
import { useRouter } from "next/navigation";
import type { InsightData } from "@/types/index";

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  SPENDING_PATTERN: { icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  ANOMALY: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  SAVING_TIP: { icon: Lightbulb, color: "text-income", bg: "bg-income/10" },
  BUDGET: { icon: Target, color: "text-purple-400", bg: "bg-purple-400/10" },
};

interface InsightsPanelProps {
  insights: InsightData[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError("");
    const result = await generateInsights();
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              AI-Powered Insights
            </h2>
            <p className="text-xs text-muted">
              Personalized financial recommendations
            </p>
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          loading={loading}
          variant="secondary"
          size="sm"
        >
          <RefreshCw className="h-4 w-4" />
          {insights.length === 0 ? "Generate" : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="bg-expense/10 border border-expense/20 rounded-xl p-4 text-sm text-expense">
          {error}
        </div>
      )}

      {insights.length === 0 && !error ? (
        <Card className="text-center py-12">
          <Sparkles className="h-12 w-12 text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted text-sm">No insights yet.</p>
          <p className="text-muted text-xs mt-1">
            Click &quot;Generate&quot; to get AI-powered financial recommendations.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => {
            const config = typeConfig[insight.type] || typeConfig.SPENDING_PATTERN;
            const Icon = config.icon;
            return (
              <Card key={insight.id} hover>
                <div className="flex items-start gap-4">
                  <div
                    className={`h-10 w-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${config.color} uppercase tracking-wider`}
                      >
                        {insight.type.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {insight.content}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

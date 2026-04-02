"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { TransactionWithCategory } from "@/types/index";

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className="text-sm text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">
            No transactions yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: `${t.category.color}20`,
                      color: t.category.color || "#6366f1",
                    }}
                  >
                    {t.category.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-muted">
                      {t.category.name} &middot; {formatDateShort(t.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <Badge variant={t.type === "INCOME" ? "income" : "expense"}>
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

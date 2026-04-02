"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTransaction } from "@/actions/transactions";
import { TransactionForm } from "./transaction-form";
import type { TransactionWithCategory } from "@/types/index";

interface TransactionTableProps {
  transactions: TransactionWithCategory[];
  categories: { id: string; name: string }[];
}

export function TransactionTable({
  transactions,
  categories,
}: TransactionTableProps) {
  const [editTxn, setEditTxn] = useState<TransactionWithCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setDeletingId(id);
    await deleteTransaction(id);
    setDeletingId(null);
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-sm">No transactions found.</p>
        <p className="text-muted text-xs mt-1">
          Try adjusting your filters or add a new transaction.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-medium text-muted">Date</th>
              <th className="pb-3 font-medium text-muted">Description</th>
              <th className="pb-3 font-medium text-muted hidden sm:table-cell">
                Category
              </th>
              <th className="pb-3 font-medium text-muted">Type</th>
              <th className="pb-3 font-medium text-muted text-right">Amount</th>
              <th className="pb-3 font-medium text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 text-muted whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="py-3 text-foreground">
                  <div>
                    <span className="font-medium">{t.description}</span>
                    {t.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {t.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} className="text-[10px] px-1.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: t.category.color || "#6366f1" }}
                    />
                    <span className="text-muted">{t.category.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <Badge variant={t.type === "INCOME" ? "income" : "expense"}>
                    {t.type}
                  </Badge>
                </td>
                <td className="py-3 text-right font-medium whitespace-nowrap">
                  <span
                    className={t.type === "INCOME" ? "text-income" : "text-expense"}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditTxn(t)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(t.id)}
                      loading={deletingId === t.id}
                      className="text-expense hover:text-expense"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionForm
        open={!!editTxn}
        onClose={() => setEditTxn(null)}
        categories={categories}
        transaction={editTxn}
      />
    </>
  );
}

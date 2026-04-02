"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { TransactionForm } from "./transaction-form";

interface TransactionFiltersProps {
  categories: { id: string; name: string }[];
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/transactions?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(() => {
    updateParams("search", search);
  }, [search, updateParams]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-border text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>

        <Select
          options={[
            { value: "ALL", label: "All types" },
            { value: "INCOME", label: "Income" },
            { value: "EXPENSE", label: "Expense" },
          ]}
          defaultValue={searchParams.get("type") || "ALL"}
          onChange={(e) => updateParams("type", e.target.value)}
          className="sm:w-40"
        />

        <Select
          options={[
            { value: "ALL", label: "All categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          defaultValue={searchParams.get("categoryId") || "ALL"}
          onChange={(e) => updateParams("categoryId", e.target.value)}
          className="sm:w-48"
        />

        <Button onClick={() => setFormOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories}
      />
    </>
  );
}

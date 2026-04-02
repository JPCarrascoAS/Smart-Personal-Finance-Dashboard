import { Suspense } from "react";
import { getTransactions, getCategories } from "@/actions/transactions";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { Pagination } from "@/components/transactions/pagination";
import { SkeletonCard } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    categoryId?: string;
    search?: string;
  }>;
}

async function TransactionsContent({ searchParams }: { searchParams: Awaited<PageProps["searchParams"]> }) {
  const page = parseInt(searchParams.page || "1", 10);
  const type = searchParams.type;
  const categoryId = searchParams.categoryId;
  const search = searchParams.search;

  const [data, categories] = await Promise.all([
    getTransactions({ page, type, categoryId, search }),
    getCategories(),
  ]);

  return (
    <>
      <TransactionFilters categories={categories} />
      <Card>
        <CardContent>
          <TransactionTable
            transactions={data.transactions}
            categories={categories}
          />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default async function TransactionsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted mt-1">
          Manage your income and expenses
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <SkeletonCard lines={1} />
            <SkeletonCard lines={8} />
          </div>
        }
      >
        <TransactionsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

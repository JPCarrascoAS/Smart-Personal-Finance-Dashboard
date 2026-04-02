"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import type { TransactionWithCategory } from "@/types/index";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  transaction?: TransactionWithCategory | null;
}

export function TransactionForm({
  open,
  onClose,
  categories,
  transaction,
}: TransactionFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!transaction;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = isEdit
      ? await updateTransaction(transaction!.id, formData)
      : await createTransaction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  }

  const defaultDate = transaction
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Transaction" : "Add Transaction"}
    >
      <form action={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-expense/10 border border-expense/20 rounded-xl p-3 text-sm text-expense">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="type"
            name="type"
            label="Type"
            defaultValue={transaction?.type || "EXPENSE"}
            options={[
              { value: "EXPENSE", label: "Expense" },
              { value: "INCOME", label: "Income" },
            ]}
          />

          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            label="Amount ($)"
            placeholder="0.00"
            defaultValue={transaction?.amount?.toString() || ""}
            required
          />
        </div>

        <Input
          id="description"
          name="description"
          type="text"
          label="Description"
          placeholder="What was this for?"
          defaultValue={transaction?.description || ""}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="date"
            name="date"
            type="date"
            label="Date"
            defaultValue={defaultDate}
            required
          />

          <Select
            id="categoryId"
            name="categoryId"
            label="Category"
            placeholder="Select a category"
            defaultValue={transaction?.categoryId || ""}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <Input
          id="tags"
          name="tags"
          type="text"
          label="Tags (comma-separated)"
          placeholder="food, lunch, work"
          defaultValue={transaction?.tags?.join(", ") || ""}
        />

        <Input
          id="notes"
          name="notes"
          type="text"
          label="Notes (optional)"
          placeholder="Any additional notes"
          defaultValue={transaction?.notes || ""}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

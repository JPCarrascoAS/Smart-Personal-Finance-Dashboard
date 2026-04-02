import { z } from "zod/v4";

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().min(1, "Description is required").max(200),
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

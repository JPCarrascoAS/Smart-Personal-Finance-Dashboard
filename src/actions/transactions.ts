"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createTransaction(formData: FormData) {
  const userId = await getUserId();

  const raw = {
    amount: parseFloat(formData.get("amount") as string),
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string,
    categoryId: formData.get("categoryId") as string,
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [],
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = transactionSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  await prisma.transaction.create({
    data: {
      amount: data.amount,
      type: data.type as "INCOME" | "EXPENSE",
      description: data.description,
      date: new Date(data.date),
      categoryId: data.categoryId,
      tags: data.tags,
      notes: data.notes || null,
      userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function updateTransaction(id: string, formData: FormData) {
  const userId = await getUserId();

  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  if (!existing) return { error: "Transaction not found" };

  const raw = {
    amount: parseFloat(formData.get("amount") as string),
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string,
    categoryId: formData.get("categoryId") as string,
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [],
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = transactionSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  await prisma.transaction.update({
    where: { id },
    data: {
      amount: data.amount,
      type: data.type as "INCOME" | "EXPENSE",
      description: data.description,
      date: new Date(data.date),
      categoryId: data.categoryId,
      tags: data.tags,
      notes: data.notes || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId();

  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  if (!existing) return { error: "Transaction not found" };

  await prisma.transaction.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function getTransactions(params: {
  page?: number;
  limit?: number;
  type?: string;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const userId = await getUserId();
  const { page = 1, limit = 20, type, categoryId, search, sortBy = "date", sortOrder = "desc" } = params;

  const where: Record<string, unknown> = { userId };
  if (type && type !== "ALL") where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.description = { contains: search, mode: "insensitive" };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions: transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
}

export async function getCategories() {
  const session = await auth();
  const userId = session?.user?.id;

  return prisma.category.findMany({
    where: {
      OR: [{ isDefault: true }, ...(userId ? [{ userId }] : [])],
    },
    orderBy: { name: "asc" },
  });
}

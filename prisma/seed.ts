import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  { name: "Food & Dining", icon: "UtensilsCrossed", color: "#f97316", isDefault: true },
  { name: "Transport", icon: "Car", color: "#3b82f6", isDefault: true },
  { name: "Housing", icon: "Home", color: "#8b5cf6", isDefault: true },
  { name: "Entertainment", icon: "Gamepad2", color: "#ec4899", isDefault: true },
  { name: "Shopping", icon: "ShoppingBag", color: "#f43f5e", isDefault: true },
  { name: "Health", icon: "Heart", color: "#10b981", isDefault: true },
  { name: "Education", icon: "GraduationCap", color: "#06b6d4", isDefault: true },
  { name: "Utilities", icon: "Zap", color: "#eab308", isDefault: true },
  { name: "Salary", icon: "Banknote", color: "#22c55e", isDefault: true },
  { name: "Freelance", icon: "Laptop", color: "#6366f1", isDefault: true },
  { name: "Investment", icon: "TrendingUp", color: "#14b8a6", isDefault: true },
  { name: "Other", icon: "MoreHorizontal", color: "#94a3b8", isDefault: true },
];

async function main() {
  console.log("Seeding default categories...");

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { id: category.name.toLowerCase().replace(/[^a-z0-9]/g, "-") },
      update: {},
      create: {
        id: category.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        ...category,
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

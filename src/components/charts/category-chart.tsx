"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { CategoryBreakdown } from "@/types/index";

interface CategoryChartProps {
  data: CategoryBreakdown[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: CategoryBreakdown }[];
}) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload;

  return (
    <div className="glass rounded-xl p-3 text-sm">
      <p className="text-foreground font-medium">{item.name}</p>
      <p className="text-muted">
        {formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)
      </p>
    </div>
  );
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted text-sm">
        No expense data this month
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="amount"
            nameKey="name"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full max-w-xs">
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

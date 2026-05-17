"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { revenueData } from "@/data/dashboard";
import {
  OperationalState,
  PremiumSkeleton,
} from "@/components/dashboard/operational-state";

type TooltipPayload = {
  name: string;
  value: number;
  color: string;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f0f0f]/95 p-3 text-xs shadow-2xl">
      <p className="mb-2 font-medium text-[#f8f8f8]">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-medium text-[#f8f8f8]">R$ {item.value}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  const hasData = revenueData.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-[310px] w-full">
      {!hasData ? (
        <div className="grid size-full place-items-center rounded-[1.5rem] bg-white/[0.025] p-4">
          <OperationalState kind="empty" className="max-w-md" />
        </div>
      ) : !mounted ? (
        <div className="relative flex size-full items-end gap-3 rounded-[1.5rem] border border-white/[0.06] bg-white/[0.025] p-4">
          {[44, 62, 58, 76, 82, 88, 96].map((height, index) => (
            <PremiumSkeleton
              key={`${height}-${index}`}
              className="flex-1 rounded-t-2xl"
              style={{ height: `${height}%` }}
            />
          ))}
          <div className="absolute left-6 top-6">
            <OperationalState kind="loading" className="w-[280px] p-3" />
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{ left: -20, right: 10, top: 10 }}
          >
            <defs>
              <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5dd62c" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#5dd62c" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expansao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#337418" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#337418" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(248,248,248,0.08)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#5dd62c" }} />
            <Area
              type="monotone"
              dataKey="receita"
              name="Receita"
              stroke="#5dd62c"
              strokeWidth={3}
              fill="url(#receita)"
            />
            <Area
              type="monotone"
              dataKey="expansao"
              name="Expansao"
              stroke="#337418"
              strokeWidth={3}
              fill="url(#expansao)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

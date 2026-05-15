"use client";

import { motion } from "framer-motion";

import { MetricCard } from "@/components/dashboard/metric-card";
import { metrics } from "@/data/dashboard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function MetricsGrid() {
  return (
    <motion.section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {metrics.map((metric) => (
        <motion.div key={metric.label} variants={item}>
          <MetricCard metric={metric} />
        </motion.div>
      ))}
    </motion.section>
  );
}

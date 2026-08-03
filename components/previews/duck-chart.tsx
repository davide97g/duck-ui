"use client";

import { DuckChart } from "@/components/ui/duck-chart";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function DuckChartDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8 text-left">
      <DuckChart
        title="Installs per month"
        labels={months}
        series={[
          { name: "Components", values: [12, 19, 24, 31, 38, 52] },
          { name: "Themes", values: [4, 6, 9, 11, 14, 21] },
        ]}
      />
      <DuckChart
        type="area"
        title="Bundle size removed, kB"
        labels={months}
        series={[{ name: "kB removed", values: [0, 8, 14, 31, 58, 76] }]}
      />
    </div>
  );
}

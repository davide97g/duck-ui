"use client";

import { BarChart3, LayoutGrid, LifeBuoy, Settings, Users } from "lucide-react";

import { DuckDashboard } from "@/components/blocks/duck-dashboard";
import {
  StickerCard,
  StickerCardDescription,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";

export default function DuckDashboardDemo() {
  return (
    <DuckDashboard
      className="min-h-[34rem] overflow-hidden rounded-xl border-2 border-border"
      title="Overview"
      user={{ name: "Davide", fallback: "DG" }}
      onSearch={() => {}}
      nav={[
        { label: "Overview", icon: <LayoutGrid />, active: true },
        { label: "Analytics", icon: <BarChart3 /> },
        { label: "Members", icon: <Users />, badge: "12" },
      ]}
      footerNav={[
        { label: "Settings", icon: <Settings /> },
        { label: "Support", icon: <LifeBuoy /> },
      ]}
      stats={[
        { label: "Installs", value: "12,480", hint: "+18% this week" },
        { label: "Components", value: "31", hint: "one theme, one hook" },
        { label: "Registry uptime", value: "99.98%", progress: 99 },
        { label: "Open issues", value: "4", hint: "median close: 2 days" },
      ]}
    >
      <StickerCard className="flex-1">
        <StickerCardHeader>
          <StickerCardTitle>Your page goes here</StickerCardTitle>
          <StickerCardDescription>
            Everything under the stat row is children. The shell only owns the
            sidebar, the top bar and the spacing.
          </StickerCardDescription>
        </StickerCardHeader>
      </StickerCard>
    </DuckDashboard>
  );
}

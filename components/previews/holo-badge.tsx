import { CircleCheck, Sparkles, TriangleAlert } from "lucide-react";

import { HoloBadge } from "@/components/ui/holo-badge";

export default function HoloBadgeDemo() {
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      <HoloBadge variant="holo">
        <Sparkles />
        v0.1 preview
      </HoloBadge>
      <HoloBadge variant="primary">New</HoloBadge>
      <HoloBadge variant="outline">Edge runtime</HoloBadge>
      <HoloBadge variant="muted">Draft</HoloBadge>
      <HoloBadge variant="success">
        <CircleCheck />
        Deployed
      </HoloBadge>
      <HoloBadge variant="danger">
        <TriangleAlert />
        Quota reached
      </HoloBadge>
      {/* A tag follows the radius scale; a status pill stays round. */}
      <HoloBadge variant="outline" shape="tag">
        typescript
      </HoloBadge>
    </div>
  );
}

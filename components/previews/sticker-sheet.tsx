import { Sparkles } from "lucide-react";

import { DuckSpinner } from "@/components/ui/duck-spinner";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import { StickerSheet, StickerSheetCell } from "@/components/ui/sticker-sheet";

export default function StickerSheetDemo() {
  return (
    <StickerSheet label="Sheet 03" className="w-full max-w-2xl">
      <StickerSheetCell label="HoloBadge">
        <HoloBadge variant="primary">
          <Sparkles />
          Shipping v0.1
        </HoloBadge>
      </StickerSheetCell>
      <StickerSheetCell label="DuckSpinner">
        <DuckSpinner size="lg" label="Packing your order" />
      </StickerSheetCell>
      <StickerSheetCell label="HoloButton">
        <HoloButton variant="holo">Peel and stick</HoloButton>
      </StickerSheetCell>
    </StickerSheet>
  );
}

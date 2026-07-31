import { Clapperboard } from "lucide-react";

import { EmptyPond } from "@/components/ui/empty-pond";
import { QuackButton } from "@/components/ui/quack-button";

export default function EmptyPondDemo() {
  return (
    <div className="grid w-full gap-2 sm:grid-cols-2 sm:divide-x sm:divide-border">
      <EmptyPond
        title="No stickers yet"
        hint="Upload artwork and it lands on the sheet, ready to cut."
        action={<QuackButton size="sm">Upload artwork</QuackButton>}
      />

      {/* A large duck is off-domain in a film app; the frame is not. The art
          node renders as given, so it carries its own size and float. */}
      <EmptyPond
        art={
          <Clapperboard
            strokeWidth={1.5}
            className="relative size-14 text-primary [animation:duck-float_5s_ease-in-out_infinite]"
          />
        }
        title="Nothing to continue"
        hint="Start something and it waits here, at the minute you left it."
        action={
          <QuackButton size="sm" variant="outline">
            Browse the library
          </QuackButton>
        }
      />
    </div>
  );
}

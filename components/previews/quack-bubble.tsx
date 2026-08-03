import { Orbit } from "lucide-react";

import { QuackBubble } from "@/components/ui/quack-bubble";
import { DuckThinking } from "@/components/ui/duck-thinking";

export default function QuackBubbleDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <QuackBubble from="user" meta="14:02">
        Which duck component should I use for a file upload?
      </QuackBubble>
      <QuackBubble meta="duck/ui assistant">
        StickerDrop. It wraps a real file input, so the picker is still there
        for anyone not dragging.
      </QuackBubble>
      <QuackBubble from="user" meta="14:03">
        Does it validate size?
      </QuackBubble>
      <QuackBubble>
        <DuckThinking showLabel={false} />
      </QuackBubble>
      <QuackBubble
        meta="another brand's assistant"
        mark={<Orbit className="size-5 text-primary" />}
      >
        The mark is a prop. Pass your own and the rest of the bubble stays put.
      </QuackBubble>
    </div>
  );
}

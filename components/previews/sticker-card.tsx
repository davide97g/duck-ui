import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerCard,
  StickerCardContent,
  StickerCardDescription,
  StickerCardFooter,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";

export default function StickerCardDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <StickerCard peel>
        <StickerCardHeader>
          <StickerCardTitle>Pond Starter</StickerCardTitle>
          <StickerCardDescription>
            For one developer shipping nights and weekends.
          </StickerCardDescription>
        </StickerCardHeader>
        <StickerCardContent className="text-sm text-muted-foreground">
          3 projects, 10k monthly requests, community support.
        </StickerCardContent>
        <StickerCardFooter>
          <QuackButton variant="outline" size="sm">
            Start building
          </QuackButton>
        </StickerCardFooter>
      </StickerCard>

      <StickerCard holo>
        <StickerCardHeader>
          <StickerCardTitle>Flock Team</StickerCardTitle>
          <StickerCardDescription>
            Shared components and review flows for the whole team.
          </StickerCardDescription>
        </StickerCardHeader>
        <StickerCardContent className="text-sm text-muted-foreground">
          Unlimited projects, SSO, and a private registry.
        </StickerCardContent>
        <StickerCardFooter>
          <QuackButton size="sm">Upgrade the flock</QuackButton>
        </StickerCardFooter>
      </StickerCard>

      {/* asChild: the whole card is the link, ticks included. */}
      <StickerCard asChild ticks className="sm:col-span-2">
        <a href="#sticker-card">
          <StickerCardHeader>
            <StickerCardTitle>Migration notes</StickerCardTitle>
            <StickerCardDescription>
              One card, one link, one focus stop — no nested anchor to tab past.
            </StickerCardDescription>
          </StickerCardHeader>
        </a>
      </StickerCard>
    </div>
  );
}

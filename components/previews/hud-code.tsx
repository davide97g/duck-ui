import { DuckProse } from "@/components/ui/duck-prose";
import { HudCode } from "@/components/ui/hud-code";

export default function HudCodeDemo() {
  return (
    <DuckProse className="text-left">
      <p>
        The survey puts the count at forty-one birds, which agrees with{" "}
        <HudCode>[[pond/2026-03]]</HudCode> and contradicts the ranger&apos;s
        note from the week before. She says as much on the tape at{" "}
        {/* The interactive form. asChild because this citation has a URL; pass
            interactive instead when the click is a handler and nothing else. */}
        <HudCode asChild>
          <a href="#hud-code">@ 00:12:04</a>
        </HudCode>
        , which is worth hearing before quoting either figure.
      </p>
      <p>
        Both chips sit inside prose that styles <code>code</code> as a neutral
        chip. One plain class beats it: every DuckProse rule is wrapped in{" "}
        <code>:where()</code>, so all of them are zero specificity and nothing
        here needs <code>!important</code>.
      </p>
    </DuckProse>
  );
}

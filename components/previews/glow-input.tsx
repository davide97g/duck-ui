import {
  GlowField,
  GlowFieldset,
  GlowInput,
} from "@/components/ui/glow-input";

export default function GlowInputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <GlowField
        label="Workspace name"
        helper="Shows up in the sidebar and on every invite."
        required
      >
        <GlowInput placeholder="Pond Studio" defaultValue="Pond Studio" />
      </GlowField>
      <GlowField
        label="Billing email"
        error="That address is already tied to another workspace."
      >
        <GlowInput
          type="email"
          placeholder="you@studio.dev"
          defaultValue="mira.okonkwo@pondstudio.dev"
        />
      </GlowField>
      <GlowFieldset
        legend="Invoice address"
        helper="Both lines print on the receipt."
      >
        <GlowInput placeholder="Street" defaultValue="14 Reedbank Way" />
        <GlowInput placeholder="City" defaultValue="Padua" />
      </GlowFieldset>
    </div>
  );
}

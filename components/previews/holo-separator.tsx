import { HoloSeparator } from "@/components/ui/holo-separator";

export default function HoloSeparatorDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Nadia Ferrante shipped the pond migration at 04:12.
      </p>
      <HoloSeparator label="Deploy log" />
      <p className="text-sm text-muted-foreground">
        Rollout reached every edge region in under two minutes.
      </p>
      <HoloSeparator />
      <p className="text-sm text-muted-foreground">
        Next window opens Thursday, right after the schema freeze.
      </p>
    </div>
  );
}

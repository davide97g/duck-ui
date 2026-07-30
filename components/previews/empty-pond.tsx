import { EmptyPond } from "@/components/ui/empty-pond";
import { QuackButton } from "@/components/ui/quack-button";

export default function EmptyPondDemo() {
  return (
    <EmptyPond
      title="No stickers yet"
      hint="Upload artwork and it lands on the sheet, ready to cut."
      action={<QuackButton size="sm">Upload artwork</QuackButton>}
    />
  );
}

import { HoloButton } from "@/components/ui/holo-button";

export default function HoloButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <HoloButton variant="holo">Get the kit</HoloButton>
      <HoloButton variant="primary">Start building</HoloButton>
      <HoloButton variant="outline">Read the docs</HoloButton>
      <HoloButton variant="ghost">Changelog</HoloButton>
    </div>
  );
}

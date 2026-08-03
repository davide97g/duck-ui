import { DuckSectionMarker } from "@/components/ui/duck-section-marker";

export default function DuckSectionMarkerDemo() {
  return (
    // The group is what wakes the dot up: hover anywhere in the section.
    <section className="group/section flex w-full max-w-xl flex-col gap-4 text-left">
      <DuckSectionMarker index="03">Selected work</DuckSectionMarker>
      <p className="text-sm text-muted-foreground">
        The rule dissolves instead of stopping, which is the difference between
        a divider between two things and an annotation on the one below it.
      </p>
      <DuckSectionMarker>No index, still chrome</DuckSectionMarker>
    </section>
  );
}

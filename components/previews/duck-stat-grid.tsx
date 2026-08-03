import { DuckStat, DuckStatGrid } from "@/components/ui/duck-stat-grid";

export default function DuckStatGridDemo() {
  return (
    <DuckStatGrid cols={3} className="w-full max-w-2xl text-left">
      <DuckStat label="Runtime deps" value="17" hint="down from 47" />
      <DuckStat label="JS shipped" value="76 kB" hint="removed" />
      <DuckStat label="Components" value="49" hint="one file each" />
    </DuckStatGrid>
  );
}

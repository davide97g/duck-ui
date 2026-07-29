import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function ThemeSwitcherDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ThemeSwitcher />
      <p className="text-xs text-muted-foreground">
        Light, dark or follow the system.
      </p>
    </div>
  );
}

import {
  DuckTabs,
  DuckTabsContent,
  DuckTabsList,
  DuckTabsTrigger,
} from "@/components/ui/duck-tabs";
import { HudLabel } from "@/components/ui/hud-label";

export default function DuckTabsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <DuckTabs defaultValue="overview">
        <DuckTabsList>
          <DuckTabsTrigger value="overview">Overview</DuckTabsTrigger>
          <DuckTabsTrigger value="usage">Usage</DuckTabsTrigger>
          <DuckTabsTrigger value="billing">Billing</DuckTabsTrigger>
        </DuckTabsList>
        <DuckTabsContent value="overview" className="text-sm text-muted-foreground">
          Pond Studio runs on the Flock plan with four active projects and two
          staging environments.
        </DuckTabsContent>
        <DuckTabsContent value="usage" className="text-sm text-muted-foreground">
          1.2M edge requests this cycle, about 38 percent of the included quota.
          Peak traffic landed Tuesday at 19:00 CET.
        </DuckTabsContent>
        <DuckTabsContent value="billing" className="text-sm text-muted-foreground">
          Next invoice of 84 EUR is due on 12 August, charged to the card ending
          in 4417.
        </DuckTabsContent>
      </DuckTabs>

      {/* The settings-dialog shape: a section rail beside the panel, Up and Down
          between sections, and the indicator as a bar on the left edge. */}
      <div className="flex flex-col gap-2">
        <HudLabel>vertical</HudLabel>
        <DuckTabs defaultValue="canvas" orientation="vertical">
          <DuckTabsList frame={false} className="w-32 bg-transparent p-0">
            <DuckTabsTrigger value="canvas">Canvas</DuckTabsTrigger>
            <DuckTabsTrigger value="export">Export</DuckTabsTrigger>
            <DuckTabsTrigger value="shortcuts">Shortcuts</DuckTabsTrigger>
          </DuckTabsList>
          <DuckTabsContent value="canvas" className="text-sm text-muted-foreground">
            1280×720, snapping on, grid every 8px.
          </DuckTabsContent>
          <DuckTabsContent value="export" className="text-sm text-muted-foreground">
            PNG at 2× density, metadata stripped.
          </DuckTabsContent>
          <DuckTabsContent
            value="shortcuts"
            className="text-sm text-muted-foreground"
          >
            ⌘K opens the palette, V picks, R draws a rectangle.
          </DuckTabsContent>
        </DuckTabs>
      </div>
    </div>
  );
}

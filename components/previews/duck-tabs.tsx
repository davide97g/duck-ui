import {
  DuckTabs,
  DuckTabsContent,
  DuckTabsList,
  DuckTabsTrigger,
} from "@/components/ui/duck-tabs";

export default function DuckTabsDemo() {
  return (
    <DuckTabs defaultValue="overview" className="w-full max-w-md">
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
  );
}

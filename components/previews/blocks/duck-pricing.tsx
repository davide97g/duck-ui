import { DuckPricing } from "@/components/blocks/duck-pricing";

export default function DuckPricingDemo() {
  return (
    <DuckPricing
      className="px-0 py-0 lg:py-0"
      title="Pick a pond."
      description="Every tier ships the same source. The difference is how much of it we look after."
      yearlyNote="Two months free on every yearly plan."
      tiers={[
        {
          name: "Puddle",
          description: "For the side project that might become a company.",
          monthly: 0,
          yearly: 0,
          features: ["All 31 components", "MIT licence", "Community support"],
          action: { label: "Start free", href: "#" },
        },
        {
          name: "Pond",
          description: "For the team shipping every week.",
          monthly: 29,
          yearly: 24,
          badge: "Most popular",
          featured: true,
          features: [
            "Everything in Puddle",
            "Private blocks registry",
            "Theme presets for your brand",
            "Priority issues",
          ],
          action: { label: "Start the trial", href: "#" },
        },
        {
          name: "Lake",
          description: "For design systems with a headcount.",
          monthly: "Talk to us",
          features: [
            "Everything in Pond",
            "Figma kit and tokens sync",
            "Onboarding workshop",
            "Shared Slack channel",
          ],
          action: { label: "Book a call", href: "#" },
        },
      ]}
    />
  );
}

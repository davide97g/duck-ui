import DuckDashboardDemo from "./duck-dashboard";
import DuckHeroDemo from "./duck-hero";
import DuckPricingDemo from "./duck-pricing";

/** Every block example, keyed by block slug. */
export const blockPreviews = {
  "duck-dashboard": DuckDashboardDemo,
  "duck-hero": DuckHeroDemo,
  "duck-pricing": DuckPricingDemo,
} as const;

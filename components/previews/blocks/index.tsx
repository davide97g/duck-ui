import DuckDashboardDemo from "./duck-dashboard";
import DuckHeroDemo from "./duck-hero";
import DuckPricingDemo from "./duck-pricing";
import DuckSiteFooterDemo from "./duck-site-footer";
import DuckSiteHeaderDemo from "./duck-site-header";

/** Every block example, keyed by block slug. */
export const blockPreviews = {
  "duck-dashboard": DuckDashboardDemo,
  "duck-hero": DuckHeroDemo,
  "duck-pricing": DuckPricingDemo,
  "duck-site-footer": DuckSiteFooterDemo,
  "duck-site-header": DuckSiteHeaderDemo,
} as const;

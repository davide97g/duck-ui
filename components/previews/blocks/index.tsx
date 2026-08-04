import DuckChatThreadDemo from "./duck-chat-thread";
import DuckCtaBandDemo from "./duck-cta-band";
import DuckDashboardDemo from "./duck-dashboard";
import DuckFaqDemo from "./duck-faq";
import DuckHeroDemo from "./duck-hero";
import DuckLogoWallDemo from "./duck-logo-wall";
import DuckPricingDemo from "./duck-pricing";
import DuckSiteFooterDemo from "./duck-site-footer";
import DuckSiteHeaderDemo from "./duck-site-header";
import DuckWorkbenchDemo from "./duck-workbench";

/** Every block example, keyed by block slug. */
export const blockPreviews = {
  "duck-chat-thread": DuckChatThreadDemo,
  "duck-cta-band": DuckCtaBandDemo,
  "duck-dashboard": DuckDashboardDemo,
  "duck-faq": DuckFaqDemo,
  "duck-hero": DuckHeroDemo,
  "duck-logo-wall": DuckLogoWallDemo,
  "duck-pricing": DuckPricingDemo,
  "duck-site-footer": DuckSiteFooterDemo,
  "duck-site-header": DuckSiteHeaderDemo,
  "duck-workbench": DuckWorkbenchDemo,
} as const;

import AnnouncementDemo from "./announcement";
import CodeWindowDemo from "./code-window";
import CopyButtonDemo from "./copy-button";
import DuckSpinnerDemo from "./duck-spinner";
import DuckTabsDemo from "./duck-tabs";
import GlowInputDemo from "./glow-input";
import HoloAvatarDemo from "./holo-avatar";
import HoloBadgeDemo from "./holo-badge";
import HoloButtonDemo from "./holo-button";
import HoloSeparatorDemo from "./holo-separator";
import QuackButtonDemo from "./quack-button";
import QuackToastDemo from "./quack-toast";
import StickerCardDemo from "./sticker-card";
import StickerSheetDemo from "./sticker-sheet";
import TerminalDemo from "./terminal";
import ThemeSwitcherDemo from "./theme-switcher";
import VideoCardDemo from "./video-card";

/** Every documented example, keyed by component slug. */
export const previews = {
  announcement: AnnouncementDemo,
  "code-window": CodeWindowDemo,
  "copy-button": CopyButtonDemo,
  "duck-spinner": DuckSpinnerDemo,
  "duck-tabs": DuckTabsDemo,
  "glow-input": GlowInputDemo,
  "holo-avatar": HoloAvatarDemo,
  "holo-badge": HoloBadgeDemo,
  "holo-button": HoloButtonDemo,
  "holo-separator": HoloSeparatorDemo,
  "quack-button": QuackButtonDemo,
  "quack-toast": QuackToastDemo,
  "sticker-card": StickerCardDemo,
  "sticker-sheet": StickerSheetDemo,
  terminal: TerminalDemo,
  "theme-switcher": ThemeSwitcherDemo,
  "video-card": VideoCardDemo,
} as const;

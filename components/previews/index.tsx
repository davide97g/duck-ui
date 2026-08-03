import AnnouncementDemo from "./announcement";
import CodeSnippetDemo from "./code-snippet";
import CodeWindowDemo from "./code-window";
import CopyButtonDemo from "./copy-button";
import DuckAudioPlayerDemo from "./duck-audio-player";
import DuckButtonGroupDemo from "./duck-button-group";
import DuckChartDemo from "./duck-chart";
import DuckListHeaderDemo from "./duck-list-header";
import DuckListRowDemo from "./duck-list-row";
import DuckMarkDemo from "./duck-mark";
import DuckMarqueeDemo from "./duck-marquee";
import DuckMediaSliderDemo from "./duck-media-slider";
import DuckProseDemo from "./duck-prose";
import DuckRevealDemo from "./duck-reveal";
import DuckScrollRailDemo from "./duck-scroll-rail";
import DuckSectionMarkerDemo from "./duck-section-marker";
import DuckSliderDemo from "./duck-slider";
import DuckSpinnerDemo from "./duck-spinner";
import DuckStatGridDemo from "./duck-stat-grid";
import DuckSwitchDemo from "./duck-switch";
import DuckTabsDemo from "./duck-tabs";
import DuckThinkingDemo from "./duck-thinking";
import DuckTimelineDemo from "./duck-timeline";
import DuckViewportDemo from "./duck-viewport";
import DuckVolumeDemo from "./duck-volume";
import EmptyPondDemo from "./empty-pond";
import GlowInputDemo from "./glow-input";
import HoloAvatarDemo from "./holo-avatar";
import HoloBadgeDemo from "./holo-badge";
import HoloButtonDemo from "./holo-button";
import HoloSeparatorDemo from "./holo-separator";
import HudChipDemo from "./hud-chip";
import HudCodeDemo from "./hud-code";
import HudLabelDemo from "./hud-label";
import QuackBubbleDemo from "./quack-bubble";
import QuackButtonDemo from "./quack-button";
import QuackToastDemo from "./quack-toast";
import StickerCardDemo from "./sticker-card";
import StickerCarouselDemo from "./sticker-carousel";
import StickerCheckboxDemo from "./sticker-checkbox";
import StickerDialogDemo from "./sticker-dialog";
import StickerDrawerDemo from "./sticker-drawer";
import StickerDropDemo from "./sticker-drop";
import StickerKbdDemo from "./sticker-kbd";
import StickerMediaCardDemo from "./sticker-media-card";
import StickerOtpDemo from "./sticker-otp";
import StickerPopoverDemo from "./sticker-popover";
import StickerProgressDemo from "./sticker-progress";
import StickerRadioGroupDemo from "./sticker-radio-group";
import StickerSheetDemo from "./sticker-sheet";
import StickerSkeletonDemo from "./sticker-skeleton";
import StickerToggleGroupDemo from "./sticker-toggle-group";
import StickerTooltipDemo from "./sticker-tooltip";
import StreamTextDemo from "./stream-text";
import TerminalDemo from "./terminal";
import ThemeSwitcherDemo from "./theme-switcher";
import VideoCardDemo from "./video-card";

/** Every documented example, keyed by component slug. */
export const previews = {
  announcement: AnnouncementDemo,
  "code-window": CodeWindowDemo,
  "code-snippet": CodeSnippetDemo,
  "copy-button": CopyButtonDemo,
  "duck-audio-player": DuckAudioPlayerDemo,
  "duck-button-group": DuckButtonGroupDemo,
  "duck-chart": DuckChartDemo,
  "duck-list-header": DuckListHeaderDemo,
  "duck-list-row": DuckListRowDemo,
  "duck-mark": DuckMarkDemo,
  "duck-marquee": DuckMarqueeDemo,
  "duck-media-slider": DuckMediaSliderDemo,
  "duck-prose": DuckProseDemo,
  "duck-reveal": DuckRevealDemo,
  "duck-scroll-rail": DuckScrollRailDemo,
  "duck-section-marker": DuckSectionMarkerDemo,
  "duck-slider": DuckSliderDemo,
  "duck-spinner": DuckSpinnerDemo,
  "duck-stat-grid": DuckStatGridDemo,
  "duck-switch": DuckSwitchDemo,
  "duck-tabs": DuckTabsDemo,
  "duck-thinking": DuckThinkingDemo,
  "duck-timeline": DuckTimelineDemo,
  "duck-viewport": DuckViewportDemo,
  "duck-volume": DuckVolumeDemo,
  "empty-pond": EmptyPondDemo,
  "glow-input": GlowInputDemo,
  "holo-avatar": HoloAvatarDemo,
  "holo-badge": HoloBadgeDemo,
  "holo-button": HoloButtonDemo,
  "holo-separator": HoloSeparatorDemo,
  "hud-chip": HudChipDemo,
  "hud-code": HudCodeDemo,
  "hud-label": HudLabelDemo,
  "quack-bubble": QuackBubbleDemo,
  "quack-button": QuackButtonDemo,
  "quack-toast": QuackToastDemo,
  "sticker-card": StickerCardDemo,
  "sticker-carousel": StickerCarouselDemo,
  "sticker-checkbox": StickerCheckboxDemo,
  "sticker-dialog": StickerDialogDemo,
  "sticker-drawer": StickerDrawerDemo,
  "sticker-drop": StickerDropDemo,
  "sticker-kbd": StickerKbdDemo,
  "sticker-media-card": StickerMediaCardDemo,
  "sticker-otp": StickerOtpDemo,
  "sticker-popover": StickerPopoverDemo,
  "sticker-progress": StickerProgressDemo,
  "sticker-radio-group": StickerRadioGroupDemo,
  "sticker-sheet": StickerSheetDemo,
  "sticker-skeleton": StickerSkeletonDemo,
  "sticker-toggle-group": StickerToggleGroupDemo,
  "sticker-tooltip": StickerTooltipDemo,
  "stream-text": StreamTextDemo,
  terminal: TerminalDemo,
  "theme-switcher": ThemeSwitcherDemo,
  "video-card": VideoCardDemo,
} as const;

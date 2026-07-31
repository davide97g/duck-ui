import AnnouncementDemo from "./announcement";
import CodeSnippetDemo from "./code-snippet";
import CodeWindowDemo from "./code-window";
import CopyButtonDemo from "./copy-button";
import DuckMarkDemo from "./duck-mark";
import DuckSliderDemo from "./duck-slider";
import DuckSpinnerDemo from "./duck-spinner";
import DuckSwitchDemo from "./duck-switch";
import DuckTabsDemo from "./duck-tabs";
import DuckThinkingDemo from "./duck-thinking";
import EmptyPondDemo from "./empty-pond";
import GlowInputDemo from "./glow-input";
import HoloAvatarDemo from "./holo-avatar";
import HoloBadgeDemo from "./holo-badge";
import HoloButtonDemo from "./holo-button";
import HoloSeparatorDemo from "./holo-separator";
import QuackBubbleDemo from "./quack-bubble";
import QuackButtonDemo from "./quack-button";
import QuackToastDemo from "./quack-toast";
import StickerCardDemo from "./sticker-card";
import StickerCheckboxDemo from "./sticker-checkbox";
import StickerDropDemo from "./sticker-drop";
import StickerKbdDemo from "./sticker-kbd";
import StickerOtpDemo from "./sticker-otp";
import StickerProgressDemo from "./sticker-progress";
import StickerRadioGroupDemo from "./sticker-radio-group";
import StickerSheetDemo from "./sticker-sheet";
import StickerSkeletonDemo from "./sticker-skeleton";
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
  "duck-mark": DuckMarkDemo,
  "duck-slider": DuckSliderDemo,
  "duck-spinner": DuckSpinnerDemo,
  "duck-switch": DuckSwitchDemo,
  "duck-tabs": DuckTabsDemo,
  "duck-thinking": DuckThinkingDemo,
  "empty-pond": EmptyPondDemo,
  "glow-input": GlowInputDemo,
  "holo-avatar": HoloAvatarDemo,
  "holo-badge": HoloBadgeDemo,
  "holo-button": HoloButtonDemo,
  "holo-separator": HoloSeparatorDemo,
  "quack-bubble": QuackBubbleDemo,
  "quack-button": QuackButtonDemo,
  "quack-toast": QuackToastDemo,
  "sticker-card": StickerCardDemo,
  "sticker-checkbox": StickerCheckboxDemo,
  "sticker-drop": StickerDropDemo,
  "sticker-kbd": StickerKbdDemo,
  "sticker-otp": StickerOtpDemo,
  "sticker-progress": StickerProgressDemo,
  "sticker-radio-group": StickerRadioGroupDemo,
  "sticker-sheet": StickerSheetDemo,
  "sticker-skeleton": StickerSkeletonDemo,
  "stream-text": StreamTextDemo,
  terminal: TerminalDemo,
  "theme-switcher": ThemeSwitcherDemo,
  "video-card": VideoCardDemo,
} as const;

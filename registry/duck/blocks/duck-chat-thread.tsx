"use client";

import * as React from "react";
import { ArrowDown, SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { DuckThinking } from "@/components/ui/duck-thinking";
import { GlowTextarea } from "@/components/ui/glow-input";
import { QuackBubble } from "@/components/ui/quack-bubble";
import { QuackButton } from "@/components/ui/quack-button";
import { StreamText } from "@/components/ui/stream-text";

/**
 * DuckChatThread — the transcript, the wait state and the composer, joined.
 *
 * The parts were all here. What a hand-written chat gets wrong is never the
 * bubble; it is these four things, and each one is a decision rather than
 * styling.
 *
 * **Sticking to the bottom.** A thread that always scrolls to the newest token
 * cannot be read while it streams, and a thread that never does makes the reader
 * chase it. This one follows the stream only while the reader is already at the
 * bottom, stops the moment they scroll up, and offers an explicit way back —
 * which is also why the jump button exists rather than a timer that grabs the
 * scroll position back.
 *
 * **Not announcing every token.** The transcript is a `role="log"` with
 * `aria-live="polite"`, so a finished message is announced once. The streaming
 * bubble is `aria-live="off"` and `aria-busy` while it grows: a live region
 * around a token stream re-announces the whole message on every token, which is
 * a denial of service on a screen reader. When the stream ends the message
 * re-renders as ordinary content and the log announces it.
 *
 * **The composer is one surface.** The textarea takes `frame={false}` and the row
 * around it carries the sticker edge and the lime focus glow, so the send button
 * sits *inside* the field instead of beside a second box. That prop exists for
 * exactly this: without it the call site fights `.sticker`, which is declared at
 * the end of the utilities layer and wins on order.
 *
 * **Enter sends, Shift+Enter breaks the line** — and it does it by asking the
 * form to submit, so the button and the key run the same code path.
 *
 * The mark is a prop all the way through. A transcript is the last place a design
 * system should insist on its own mascot, so `mark` reaches both the bubbles and
 * the wait state.
 */
export interface DuckChatMessage {
  id: string;
  from: "assistant" | "user";
  /** Nodes for a finished message: prose, a code window, citations. */
  content: React.ReactNode;
  /** Timestamp, model name, "edited". */
  meta?: string;
  /**
   * The in-flight message. `content` must be a string here — it is rendered
   * through StreamText with the caret lit and the growing bottom edge softened.
   */
  streaming?: boolean;
}

export interface DuckChatThreadProps
  extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  messages: DuckChatMessage[];
  /** Above the transcript: a title row, a model picker, a clear button. */
  header?: React.ReactNode;
  /** Shown when there are no messages. An EmptyPond fits here. */
  empty?: React.ReactNode;
  /** The wait before the first token. Hide it once tokens arrive. */
  thinking?: boolean;
  thinkingLabel?: string;
  /** The assistant's face, for the bubbles and the wait state alike. */
  mark?: React.ReactNode;
  placeholder?: string;
  sendLabel?: string;
  /** Fires with the trimmed text. The block clears the field itself. */
  onSend?: (text: string) => void;
  /** Blocks the composer while a turn is in flight. */
  busy?: boolean;
  /** Left of the send button, inside the field: attach, model, voice. */
  composerActions?: React.ReactNode;
  /** Under the composer: the "can be wrong" line, a token count. */
  note?: React.ReactNode;
  jumpLabel?: string;
  /** Rows the composer grows to before it starts scrolling. */
  maxRows?: number;
}

/** Roughly the sticker edge plus the lime focus glow, driven by focus-within. */
const COMPOSER_SURFACE = [
  "sticker flex items-end gap-2 rounded-2xl border-input bg-card p-2",
  "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-duck)]",
  "focus-within:border-ring focus-within:duck-glow-primary",
];

function Bubble({
  message,
  mark,
}: {
  message: DuckChatMessage;
  mark?: React.ReactNode;
}) {
  const assistant = message.from !== "user";

  return (
    <div
      data-slot="duck-chat-message"
      data-from={message.from}
      className={cn("flex", assistant ? "justify-start" : "justify-end")}
    >
      <QuackBubble from={message.from} meta={message.meta} mark={mark}>
        {message.streaming ? (
          <span
            // Off inside the log's polite region: nested live regions win, so
            // this is what stops a token stream re-announcing the whole message
            // on every token.
            aria-live="off"
            aria-busy="true"
            className="duck-stream-edge"
          >
            <StreamText streaming={String(message.content)} active />
          </span>
        ) : (
          message.content
        )}
      </QuackBubble>
    </div>
  );
}

function DuckChatThread({
  className,
  messages,
  header,
  empty,
  thinking = false,
  thinkingLabel = "Thinking",
  mark,
  placeholder = "Ask something…",
  sendLabel = "Send",
  onSend,
  busy = false,
  composerActions,
  note,
  jumpLabel = "Jump to latest",
  maxRows = 8,
  ...props
}: DuckChatThreadProps) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const field = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState("");
  const [pinned, setPinned] = React.useState(true);

  /* The last rendered content, so a growing stream re-runs the follow. */
  const tail = messages.at(-1);
  const signature = `${messages.length}:${
    typeof tail?.content === "string" ? tail.content.length : 0
  }:${thinking}`;

  React.useEffect(() => {
    const node = scroller.current;
    if (!node || !pinned) return;
    // Instant, not smooth: a smooth scroll queued on every token never lands.
    node.scrollTop = node.scrollHeight;
  }, [signature, pinned]);

  const onScroll = () => {
    const node = scroller.current;
    if (!node) return;
    // 48px of slack, so a trackpad's overscroll bounce does not unpin the view.
    const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
    setPinned(distance < 48);
  };

  const jump = () => {
    const node = scroller.current;
    if (!node) return;
    setPinned(true);
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  };

  const grow = (node: HTMLTextAreaElement) => {
    // Measured in px against the computed line height, so it follows the theme's
    // type scale instead of a magic number.
    const line = parseFloat(getComputedStyle(node).lineHeight) || 20;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, line * maxRows)}px`;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    onSend?.(text);
    setValue("");
    if (field.current) {
      field.current.style.height = "auto";
      field.current.focus();
    }
    setPinned(true);
  };

  return (
    <div
      data-slot="duck-chat-thread"
      className={cn(
        "@container/thread flex h-full min-h-0 w-full flex-col gap-3",
        className
      )}
      {...props}
    >
      {header}

      <div className="relative flex min-h-0 flex-1">
        <div
          ref={scroller}
          onScroll={onScroll}
          data-slot="duck-chat-transcript"
          // A log, not a feed: the order is chronological and only the end
          // changes. aria-relevant keeps edits to earlier turns quiet.
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Conversation"
          className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto scroll-smooth px-1 py-2"
        >
          {messages.length === 0 && !thinking ? (
            empty
          ) : (
            <>
              {messages.map((message) => (
                <Bubble key={message.id} message={message} mark={mark} />
              ))}
              {thinking && (
                <DuckThinking label={thinkingLabel} showLabel mark={mark} />
              )}
            </>
          )}
        </div>

        {!pinned && <JumpToLatest label={jumpLabel} onClick={jump} />}
      </div>

      <form onSubmit={submit} data-slot="duck-chat-composer">
        <div className={cn(COMPOSER_SURFACE)}>
          {/* frame={false} is the reason the button can live inside the field:
              the row is the frame, and it carries the focus glow. */}
          <GlowTextarea
            ref={field}
            frame={false}
            rows={1}
            value={value}
            disabled={busy}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={(event) => {
              setValue(event.currentTarget.value);
              grow(event.currentTarget);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              // Ask the form to submit rather than calling submit() directly, so
              // the key and the button run the same path — validation included.
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            className="min-h-9 resize-none py-2 pl-2"
          />
          <div className="flex shrink-0 items-center gap-1 pb-0.5">
            {composerActions}
            <QuackButton
              type="submit"
              size="icon-sm"
              aria-label={sendLabel}
              disabled={busy || value.trim().length === 0}
              ripple={false}
            >
              <SendHorizontal />
            </QuackButton>
          </div>
        </div>
        {note && (
          <p className="mt-2 px-1 text-xs text-muted-foreground">{note}</p>
        )}
      </form>
    </div>
  );
}

/** The way back to the stream, once the reader has left it. */
function JumpToLatest({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <QuackButton
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      ripple={false}
      className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 gap-1.5 bg-card"
    >
      <ArrowDown />
      {label}
    </QuackButton>
  );
}

export { DuckChatThread };

"use client";

import * as React from "react";

import {
  DuckChatThread,
  type DuckChatMessage,
} from "@/components/blocks/duck-chat-thread";
import { HudCode } from "@/components/ui/hud-code";

const ANSWER =
  "Install the theme first — every component assumes its tokens exist. After that a single add pulls a component and resolves its own dependencies.";

const OPENING: DuckChatMessage[] = [
  { id: "1", from: "user", content: "How do I start with the registry?" },
  {
    id: "2",
    from: "assistant",
    meta: "duck/ui docs",
    content: (
      <>
        Add the <HudCode>@duck</HudCode> namespace to{" "}
        <HudCode>components.json</HudCode>, then install{" "}
        <HudCode>@duck/theme</HudCode> before anything else.
      </>
    ),
  },
];

/** A fake turn: the wait, then a stream, then a finished message. */
export default function DuckChatThreadDemo() {
  const [messages, setMessages] = React.useState<DuckChatMessage[]>(OPENING);
  const [thinking, setThinking] = React.useState(false);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  const send = (text: string) => {
    const turn = `${Date.now()}`;
    setMessages((current) => [
      ...current,
      { id: turn, from: "user", content: text },
    ]);
    setThinking(true);

    const at = (delay: number, run: () => void) => {
      timers.current.push(setTimeout(run, delay));
    };

    at(700, () => {
      setThinking(false);
      setMessages((current) => [
        ...current,
        { id: `${turn}-a`, from: "assistant", content: "", streaming: true },
      ]);
    });

    // Words, not characters: this is what a token stream looks like arriving.
    ANSWER.split(" ").forEach((word, index) => {
      at(800 + index * 55, () => {
        setMessages((current) =>
          current.map((message) =>
            message.id === `${turn}-a`
              ? { ...message, content: `${message.content as string}${index ? " " : ""}${word}` }
              : message
          )
        );
      });
    });

    at(800 + ANSWER.split(" ").length * 55 + 120, () => {
      setMessages((current) =>
        current.map((message) =>
          message.id === `${turn}-a`
            ? { ...message, streaming: false, meta: "duck/ui docs" }
            : message
        )
      );
    });
  };

  return (
    <DuckChatThread
      className="h-[440px]"
      messages={messages}
      thinking={thinking}
      onSend={send}
      placeholder="Ask about the registry…"
      note="Answers are made up by a timer, not a model."
    />
  );
}

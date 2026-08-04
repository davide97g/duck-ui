"use client";

import * as React from "react";

import { DuckSettingsPanel } from "@/components/blocks/duck-settings-panel";
import { DuckSwitch } from "@/components/ui/duck-switch";
import { GlowColor } from "@/components/ui/glow-color";
import { GlowInput } from "@/components/ui/glow-input";
import { GlowSelect, GlowSelectItem } from "@/components/ui/glow-select";
import { StickerRadio, StickerRadioGroup } from "@/components/ui/sticker-radio-group";

const LOADED = {
  name: "duck/ui",
  visibility: "public",
  accent: "#c6f24e",
  digest: "weekly",
  glow: true,
};

export default function DuckSettingsPanelDemo() {
  const [values, setValues] = React.useState(LOADED);
  const [saving, setSaving] = React.useState(false);

  const set = <K extends keyof typeof LOADED>(key: K, value: (typeof LOADED)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  // Dirty is the app's: it is the only side that knows what was loaded.
  const dirty = Object.keys(LOADED).some(
    (key) => values[key as keyof typeof LOADED] !== LOADED[key as keyof typeof LOADED]
  );

  return (
    <DuckSettingsPanel
      title="Project settings"
      description="Everything here is per project. The save bar arrives when something changes."
      dirty={dirty}
      saving={saving}
      onReset={() => setValues(LOADED)}
      onSubmit={(event) => {
        event.preventDefault();
        setSaving(true);
        setTimeout(() => setSaving(false), 900);
      }}
      sections={[
        {
          title: "General",
          rows: [
            {
              label: "Project name",
              description: "Shown in the registry index and in CLI output.",
              control: (
                <GlowInput
                  value={values.name}
                  onChange={(event) => set("name", event.currentTarget.value)}
                  className="w-full"
                />
              ),
            },
            {
              label: "Visibility",
              description: "Who can install from the registry URL.",
              control: (
                <GlowSelect
                  value={values.visibility}
                  onValueChange={(value) => set("visibility", value)}
                  aria-label="Visibility"
                  className="w-full"
                >
                  <GlowSelectItem value="public">Public</GlowSelectItem>
                  <GlowSelectItem value="unlisted">Unlisted</GlowSelectItem>
                  <GlowSelectItem value="private">Private</GlowSelectItem>
                </GlowSelect>
              ),
            },
          ],
        },
        {
          title: "Appearance",
          description: "Applies to the docs site, not to installed components.",
          rows: [
            {
              label: "Accent",
              description: "Seeds --primary and the glow derived from it.",
              control: (
                <GlowColor
                  value={values.accent}
                  onValueChange={(hex) => set("accent", hex)}
                  showValue
                  aria-label="Accent"
                />
              ),
            },
            {
              label: "Glow",
              description: "Soft outer glow on hover and focus.",
              control: (
                <DuckSwitch
                  checked={values.glow}
                  onChange={(event) => set("glow", event.currentTarget.checked)}
                />
              ),
            },
            {
              label: "Digest",
              description: "How often the changelog lands in your inbox.",
              // Plural control: a named group, not a label.
              labelling: "group",
              control: (
                <StickerRadioGroup
                  value={values.digest}
                  onValueChange={(value) => set("digest", value)}
                  className="items-start @lg/settings:items-end"
                >
                  <StickerRadio value="daily">Daily</StickerRadio>
                  <StickerRadio value="weekly">Weekly</StickerRadio>
                  <StickerRadio value="never">Never</StickerRadio>
                </StickerRadioGroup>
              ),
            },
          ],
        },
      ]}
    />
  );
}

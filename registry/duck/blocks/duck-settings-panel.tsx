"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { HoloSeparator } from "@/components/ui/holo-separator";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerCard } from "@/components/ui/sticker-card";

/**
 * DuckSettingsPanel — sections of rows, and the bar that saves them.
 *
 * The registry had every field and no form shape at all. A settings row is not a
 * GlowField: the label goes *beside* the control, not above it, with the
 * explanation under the label and the control right-aligned at a fixed width so
 * twenty rows line up. That is the layout half.
 *
 * The interesting half is labelling. A block cannot mint an id for a control it
 * does not own — the control arrives as a node, and cloning props into an unknown
 * element is how a settings page breaks the day someone passes a composed one. So
 * a row *is* a `<label>`, and the association is implicit: no id, no htmlFor,
 * nothing to collide when the same panel renders twice. A row whose control is
 * plural — a radio group, a slider pair, a dropzone — cannot be labelled that way,
 * because a `<label>` may only point at one control, so `group` becomes a
 * `role="group"` named by the row's own label. Getting that pair right is the
 * whole reason this block exists rather than a div with two columns in it.
 *
 * The save bar appears only when there is something to save, and it is
 * `aria-live="polite"` — the appearance of a Save button is the feedback that an
 * edit registered. It sticks to the bottom of the panel rather than the viewport,
 * so a settings panel embedded in a dialog does not pin a bar over the page
 * behind it.
 */
export interface DuckSettingsRow {
  label: React.ReactNode;
  /** One line under the label. What the setting does, not what it is called. */
  description?: React.ReactNode;
  /** The field. A GlowInput, a GlowSelect, a DuckSwitch, a GlowColor. */
  control: React.ReactNode;
  /**
   * `control` wraps the row in a label, which is the common case. `group` renders
   * a fieldset and a legend, for a control that is plural — a radio group, an OTP
   * strip, a pair of sliders — since a label may only point at one control.
   */
  labelling?: "control" | "group";
  /** Under the control: a unit, a warning, a link to the docs. */
  hint?: React.ReactNode;
  /** Stack the control under the label. For a textarea or a colour grid. */
  stacked?: boolean;
}

export interface DuckSettingsSection {
  title?: React.ReactNode;
  description?: React.ReactNode;
  rows: DuckSettingsRow[];
  /** Right of the section heading: a reset link, a docs link. */
  actions?: React.ReactNode;
}

export interface DuckSettingsPanelProps
  extends Omit<React.ComponentProps<"form">, "title" | "children"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  sections: DuckSettingsSection[];
  /** Reveals the save bar. The panel does not track values, so you own this. */
  dirty?: boolean;
  /** Disables both buttons and puts the save button in its loading state. */
  saving?: boolean;
  saveLabel?: string;
  resetLabel?: string;
  onReset?: () => void;
  /** Left of the buttons: an error, a "saved 2 minutes ago", a warning. */
  footer?: React.ReactNode;
  /** Wrap each section in a sticker card instead of separating them by a rule. */
  variant?: "plain" | "cards";
}

function Row({ row }: { row: DuckSettingsRow }) {
  const group = row.labelling === "group";
  /**
   * An id for our own label is fine; an id for the caller's control is not. So a
   * group is a `role="group"` named by `aria-labelledby` rather than a fieldset —
   * a legend has to be the fieldset's first child to name it, which the two-column
   * layout cannot give it without wrapping the legend and breaking the naming.
   */
  const labelId = `${React.useId()}-label`;

  const body = (
    <>
      <span
        className={cn(
          "flex min-w-0 flex-col gap-1",
          row.stacked ? "" : "@lg/settings:flex-1"
        )}
      >
        <span id={group ? labelId : undefined} className="text-sm font-medium">
          {row.label}
        </span>
        {row.description && (
          <span className="text-xs text-pretty text-muted-foreground">
            {row.description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "flex min-w-0 flex-col gap-1.5",
          // A fixed column, so twenty controls line up instead of each one
          // sizing itself against its own label.
          row.stacked
            ? "w-full"
            : "w-full shrink-0 @lg/settings:w-64 @lg/settings:items-end"
        )}
      >
        {row.control}
        {row.hint && (
          <span className="text-xs text-muted-foreground">{row.hint}</span>
        )}
      </span>
    </>
  );

  const shape = cn(
    "flex flex-col gap-2.5 py-4",
    row.stacked ? "" : "@lg/settings:flex-row @lg/settings:items-start @lg/settings:gap-8"
  );

  /* Plural controls cannot share one label, so they get a named group instead. */
  if (group) {
    return (
      <div
        data-slot="duck-settings-row"
        role="group"
        aria-labelledby={labelId}
        className={shape}
      >
        {body}
      </div>
    );
  }

  return (
    <label data-slot="duck-settings-row" className={cn(shape, "cursor-pointer")}>
      {body}
    </label>
  );
}

function Section({ section }: { section: DuckSettingsSection }) {
  return (
    <div data-slot="duck-settings-section" className="flex flex-col gap-1">
      {(section.title || section.description || section.actions) && (
        <div className="flex items-start justify-between gap-4 pb-2">
          <div className="flex flex-col gap-1">
            {section.title && (
              <h3 className="font-display text-base font-bold tracking-tight">
                {section.title}
              </h3>
            )}
            {section.description && (
              <p className="text-sm text-pretty text-muted-foreground">
                {section.description}
              </p>
            )}
          </div>
          {section.actions}
        </div>
      )}
      <div className="divide-y divide-border">
        {section.rows.map((row, index) => (
          <Row key={index} row={row} />
        ))}
      </div>
    </div>
  );
}

function DuckSettingsPanel({
  className,
  title,
  description,
  sections,
  dirty = false,
  saving = false,
  saveLabel = "Save changes",
  resetLabel = "Reset",
  onReset,
  footer,
  variant = "plain",
  ...props
}: DuckSettingsPanelProps) {
  return (
    <form
      data-slot="duck-settings-panel"
      className={cn(
        "@container/settings relative flex w-full flex-col gap-8",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col gap-2">
          {title && (
            <h2 className="font-display text-2xl font-extrabold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-2xl text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {sections.map((section, index) =>
        variant === "cards" ? (
          <StickerCard key={index} className="gap-0 p-6">
            <Section section={section} />
          </StickerCard>
        ) : (
          <React.Fragment key={index}>
            {index > 0 && <HoloSeparator />}
            <Section section={section} />
          </React.Fragment>
        )
      )}

      {/* Polite, because the bar arriving is the confirmation that an edit
          registered. Sticky to the panel, not the viewport: a settings panel
          inside a dialog must not pin a bar over the page behind it. */}
      <div aria-live="polite" className="sticky bottom-0">
        {dirty && (
          <div
            data-slot="duck-settings-actions"
            className="flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background/90 py-3 backdrop-blur"
          >
            {footer && (
              <div className="mr-auto text-xs text-muted-foreground">{footer}</div>
            )}
            {onReset && (
              <QuackButton
                type="button"
                variant="ghost"
                onClick={onReset}
                disabled={saving}
              >
                {resetLabel}
              </QuackButton>
            )}
            <QuackButton type="submit" state={saving ? "loading" : "idle"}>
              {saveLabel}
            </QuackButton>
          </div>
        )}
      </div>
    </form>
  );
}

export { DuckSettingsPanel };

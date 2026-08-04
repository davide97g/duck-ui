"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { GlowField, GlowInput } from "@/components/ui/glow-input";
import { HoloSeparator } from "@/components/ui/holo-separator";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerCard } from "@/components/ui/sticker-card";
import { StickerOtp } from "@/components/ui/sticker-otp";

/**
 * DuckAuthCard — sign in with a code: address first, six digits second.
 *
 * StickerOtp has shipped since the input release and nothing in the registry used
 * it, which is telling — the strip is the easy part. What a sign-in form is
 * actually made of is the four things below, and they are the ones a hand-written
 * one skips.
 *
 * **Focus moves with the step.** Swapping the form's contents leaves focus on a
 * button that no longer exists, which drops a keyboard user back at the top of the
 * document and tells a screen-reader user nothing at all. The code step focuses
 * the strip on arrival, and the step change is announced through a polite status
 * line rather than by hoping someone notices.
 *
 * **The autofill attributes are the feature.** `autoComplete="one-time-code"` on a
 * single input is what makes iOS offer the SMS code above the keyboard, and
 * StickerOtp is one real input under six cells precisely so that works. `email`
 * plus `webauthn`-friendly ordering costs nothing and is invisible until it saves
 * someone twenty seconds.
 *
 * **Resend has a cooldown that the card owns.** Otherwise every project writes the
 * same countdown, and the button that says "Resend code" is either spammable or
 * permanently disabled after the first press.
 *
 * **Errors are announced, not just red.** `error` renders in an alert region, and
 * submitting again does not clear it silently — a form that quietly forgets why it
 * failed has told the user their password is fine.
 *
 * Both handlers may return a promise. The card awaits it, drives the submit
 * button's loading state from it, and advances only on resolve — so a rejected
 * request leaves the reader on the step they can actually fix. The one holo
 * element on the screen is that button.
 */
export interface DuckAuthProvider {
  label: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export interface DuckAuthCardProps
  extends Omit<React.ComponentProps<"div">, "title" | "children" | "onSubmit"> {
  /** A mark, a wordmark, a logo. Sits above the title. */
  brand?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Called with the address. Resolve to advance to the code step. */
  onRequestCode?: (email: string) => void | Promise<unknown>;
  /** Called with the six digits. Resolve to whatever comes next. */
  onVerify?: (code: string, email: string) => void | Promise<unknown>;
  /** OAuth buttons above the field, with a separator under them. */
  providers?: DuckAuthProvider[];
  /** Digits in the code. Matches whatever you send. */
  codeLength?: number;
  /** Seconds before the resend button re-arms. */
  resendIn?: number;
  /** Verify as soon as the last digit lands. The button stays for paste. */
  submitOnComplete?: boolean;
  /** Server-side failure. Rendered in an alert region and kept until it changes. */
  error?: string;
  /** Under the card: "No account? Sign up", a support link. */
  footer?: React.ReactNode;
  /** Small print inside the card: terms, privacy. */
  legal?: React.ReactNode;
  emailLabel?: string;
  submitLabel?: string;
  verifyLabel?: string;
}

function DuckAuthCard({
  className,
  brand,
  title = "Sign in",
  description,
  onRequestCode,
  onVerify,
  providers,
  codeLength = 6,
  resendIn = 30,
  submitOnComplete = true,
  error,
  footer,
  legal,
  emailLabel = "Email",
  submitLabel = "Send code",
  verifyLabel = "Verify",
  ...props
}: DuckAuthCardProps) {
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [localError, setLocalError] = React.useState<string>();
  const [cooldown, setCooldown] = React.useState(0);
  const strip = React.useRef<HTMLInputElement>(null);
  /* One verification per code, so a paste that completes the strip and a press of
     the button do not fire two requests. */
  const sent = React.useRef<string | undefined>(undefined);

  const shown = error ?? localError;

  React.useEffect(() => {
    if (step !== "code") return;
    strip.current?.focus();
  }, [step]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const request = async () => {
    setLocalError(undefined);
    setBusy(true);
    try {
      await onRequestCode?.(email);
      setCode("");
      sent.current = undefined;
      setStep("code");
      setCooldown(resendIn);
    } catch (cause) {
      setLocalError(
        cause instanceof Error ? cause.message : "That did not work. Try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const verify = async (value: string) => {
    if (value.length !== codeLength || sent.current === value) return;
    sent.current = value;
    setLocalError(undefined);
    setBusy(true);
    try {
      await onVerify?.(value, email);
    } catch (cause) {
      // Cleared, so the same code can be retried after a network failure.
      sent.current = undefined;
      setLocalError(
        cause instanceof Error ? cause.message : "That code did not match."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-slot="duck-auth-card"
      className={cn("flex w-full max-w-sm flex-col gap-4", className)}
      {...props}
    >
      <StickerCard className="gap-5 p-7">
        <div className="flex flex-col gap-2">
          {brand}
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {step === "email" && providers && providers.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              {providers.map((provider) => (
                <QuackButton
                  key={provider.label}
                  type="button"
                  variant="outline"
                  ripple={false}
                  onClick={provider.onSelect}
                  className="w-full"
                >
                  {provider.icon}
                  {provider.label}
                </QuackButton>
              ))}
            </div>
            <HoloSeparator label="or" />
          </>
        )}

        {/* Polite, and it is the only thing that tells a listener the form
            changed under them. */}
        <p aria-live="polite" className="sr-only">
          {step === "code"
            ? `We sent a ${codeLength}-digit code to ${email}.`
            : ""}
        </p>

        {step === "email" ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void request();
            }}
          >
            <GlowField label={emailLabel}>
              <GlowInput
                type="email"
                name="email"
                autoComplete="email"
                required
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
            </GlowField>

            {shown && (
              <p role="alert" className="text-xs text-destructive">
                {shown}
              </p>
            )}

            <QuackButton
              type="submit"
              variant="holo"
              size="lg"
              state={busy ? "loading" : "idle"}
              disabled={email.trim().length === 0}
              className="w-full"
            >
              {submitLabel}
            </QuackButton>
          </form>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void verify(code);
            }}
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Code sent to <span className="font-medium text-foreground">{email}</span>.
              </p>
              <StickerOtp
                ref={strip}
                length={codeLength}
                value={code}
                // The one attribute that makes iOS offer the SMS code, and the
                // reason the strip is a single input rather than six.
                autoComplete="one-time-code"
                aria-label={`${codeLength}-digit code`}
                onValueChange={setCode}
                onComplete={(value) => {
                  if (submitOnComplete) void verify(value);
                }}
              />
            </div>

            {shown && (
              <p role="alert" className="text-xs text-destructive">
                {shown}
              </p>
            )}

            <QuackButton
              type="submit"
              variant="holo"
              size="lg"
              state={busy ? "loading" : "idle"}
              disabled={code.length !== codeLength}
              className="w-full"
            >
              {verifyLabel}
            </QuackButton>

            <div className="flex items-center justify-between gap-2 text-xs">
              <QuackButton
                type="button"
                variant="ghost"
                size="xs"
                ripple={false}
                onClick={() => {
                  setStep("email");
                  setLocalError(undefined);
                }}
              >
                Use another address
              </QuackButton>
              <QuackButton
                type="button"
                variant="ghost"
                size="xs"
                ripple={false}
                disabled={cooldown > 0 || busy}
                onClick={() => void request()}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </QuackButton>
            </div>
          </form>
        )}

        {legal && (
          <p className="text-xs text-muted-foreground">{legal}</p>
        )}
      </StickerCard>

      {footer && (
        <p className="text-center text-sm text-muted-foreground">{footer}</p>
      )}
    </div>
  );
}

export { DuckAuthCard };

import { faq } from "@/lib/faq";
import { JsonLd, faqSchema } from "@/components/seo/structured-data";
import { Reveal } from "@/components/site/reveal";

/**
 * The FAQ block and its FAQPage JSON-LD, emitted from one component so the
 * markup and the schema read the same array. Answers are rendered in full
 * rather than behind a disclosure: an answer engine quoting a collapsed panel
 * is fine, but a reader landing from that quote should not have to hunt.
 */
export function FaqSection({ path = "/" }: { path?: string }) {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border">
      <JsonLd data={faqSchema(faq, path)} />
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Questions before the install.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The eight that come up most, answered without the sales voice.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {faq.map((item, index) => (
            <Reveal key={item.question} delay={(index % 2) * 0.05}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold tracking-tight text-balance">
                  {item.question}
                </h3>
                <p className="text-sm text-pretty text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

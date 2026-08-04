import { DuckFaq } from "@/components/blocks/duck-faq";

/** jsonLd is off: the landing page already emits one FAQPage, and two is an error. */
export default function DuckFaqDemo() {
  return (
    <DuckFaq
      className="px-0 py-0 lg:py-0"
      jsonLd={false}
      collapsible
      defaultOpen={0}
      columns={1}
      title="Questions before the install."
      description="Answered without the sales voice."
      items={[
        {
          question: "Does this replace shadcn/ui?",
          answer:
            "No. duck/ui is additive and rides shadcn's distribution rails. The theme ships the full CSS variable contract, so components already in the project inherit the tokens without a markup change.",
        },
        {
          question: "Is there a runtime dependency?",
          answer:
            "No. The CLI copies source files into the repository, so there is nothing to install and nothing to remove later. Once a file lands in components/ui, it is yours to edit.",
        },
        {
          question: "What does the theme need?",
          answer:
            "React 19, Tailwind CSS v4 and a project already configured for shadcn/ui. Install the theme before any component, because every component assumes its tokens exist.",
        },
      ]}
      footer={
        <>
          Still stuck?{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="#">
            Open an issue
          </a>
          .
        </>
      }
    />
  );
}

import { DuckProse } from "@/components/ui/duck-prose";

export default function DuckProseDemo() {
  return (
    <DuckProse as="article" className="text-left">
      <h2>The pond at scale</h2>
      <p>
        Every component in this registry styles markup it can see. Prose styles
        markup it cannot: the content arrives as bare tags from an MDX file or a
        CMS, so the rules are descendant selectors on one wrapper — and every
        one of them is wrapped in <code>:where()</code>, which means a utility
        on any element inside still wins.
      </p>
      <blockquote>
        A measure of 68 characters is not a preference. It is where a line stops
        being pleasant to read.
        <cite>Typographic folklore, repeatedly confirmed</cite>
      </blockquote>
      <h3>What it reads from the theme</h3>
      <ul>
        <li>
          <strong>--font-display</strong> for headings, <strong>--font-mono</strong>{" "}
          for code and table headers.
        </li>
        <li>
          <strong>--primary</strong> for links, list markers and the blockquote
          rule.
        </li>
        <li>
          <strong>--radius</strong> for anything boxed, so a square theme squares
          the code blocks too.
        </li>
      </ul>
      <div className="duck-prose-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Element</th>
              <th scope="col">Treatment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>blockquote</code>
              </td>
              <td>Ruled, upright, muted</td>
            </tr>
            <tr>
              <td>
                <code>th</code>
              </td>
              <td>Mono, uppercase, tracked</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DuckProse>
  );
}

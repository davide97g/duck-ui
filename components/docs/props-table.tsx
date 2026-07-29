import * as React from "react";

import type { PropDoc } from "@/lib/registry-docs";

/**
 * PropsTable — the API, in one place. Scrolls sideways on narrow screens
 * rather than reflowing, because a wrapped type signature is unreadable.
 */
export function PropsTable({ props }: { props: PropDoc[] }) {
  if (props.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No props. The component reads everything it needs from context.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-border">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th scope="col" className="px-4 py-3 font-semibold">
              Prop
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Type
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Default
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border last:border-0">
              <td className="px-4 py-3 align-top font-mono text-xs font-semibold text-primary">
                {prop.name}
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {prop.type}
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {prop.default ?? "-"}
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

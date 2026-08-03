"use client";

import * as React from "react";

import {
  DuckList,
  type DuckListColumn,
  type DuckListSort,
} from "@/components/ui/duck-list-header";
import { DuckListRow } from "@/components/ui/duck-list-row";

const columns: DuckListColumn[] = [
  { key: "member", label: "Member", sortable: true },
  { key: "role", label: "Role", width: "6rem" },
  { key: "seen", label: "Last seen", width: "8rem", sortable: true },
];

const members = [
  {
    name: "Ada Quackenbush",
    email: "ada@pond.dev",
    role: "Owner",
    seen: "4 min ago",
    minutes: 4,
  },
  {
    name: "Bo Featherstone",
    email: "bo@pond.dev",
    role: "Editor",
    seen: "2 h ago",
    minutes: 120,
  },
  {
    name: "Cy Mallard",
    email: "cy@pond.dev",
    role: "Viewer",
    seen: "6 d ago",
    minutes: 8640,
  },
];

export default function DuckListHeaderDemo() {
  const [sort, setSort] = React.useState<DuckListSort>({
    key: "seen",
    direction: "ascending",
  });

  const rows = React.useMemo(() => {
    const way = sort.direction === "ascending" ? 1 : -1;
    return [...members].sort((a, b) =>
      sort.key === "member"
        ? way * a.name.localeCompare(b.name)
        : way * (a.minutes - b.minutes)
    );
  }, [sort]);

  return (
    // The widths are declared once, in columns. Not a single one on a row.
    <DuckList
      className="max-w-xl text-left"
      columns={columns}
      sort={sort}
      onSortChange={setSort}
    >
      {rows.map((member) => (
        <DuckListRow
          key={member.email}
          title={member.name}
          description={member.email}
          cells={[member.role, member.seen]}
        />
      ))}
    </DuckList>
  );
}

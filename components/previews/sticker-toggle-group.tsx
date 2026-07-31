"use client";

import * as React from "react";

import {
  StickerToggleGroup,
  StickerToggleGroupItem,
} from "@/components/ui/sticker-toggle-group";

const SORTS: Record<string, string> = {
  az: "title",
  added: "date added",
  release: "release year",
  rating: "rating",
};

export default function StickerToggleGroupDemo() {
  const [sort, setSort] = React.useState("added");
  const [filters, setFilters] = React.useState(["unwatched"]);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <StickerToggleGroup
        aria-label="Sort library"
        value={sort}
        onValueChange={setSort}
      >
        <StickerToggleGroupItem value="az">A–Z</StickerToggleGroupItem>
        <StickerToggleGroupItem value="added">Newest</StickerToggleGroupItem>
        <StickerToggleGroupItem value="release">Release</StickerToggleGroupItem>
        <StickerToggleGroupItem value="rating">Rating</StickerToggleGroupItem>
      </StickerToggleGroup>

      <StickerToggleGroup
        type="multiple"
        size="sm"
        aria-label="Filter library"
        value={filters}
        onValueChange={setFilters}
      >
        <StickerToggleGroupItem value="unwatched">
          Unwatched
        </StickerToggleGroupItem>
        <StickerToggleGroupItem value="hd">HD</StickerToggleGroupItem>
        <StickerToggleGroupItem value="subtitles">
          Subtitles
        </StickerToggleGroupItem>
        <StickerToggleGroupItem value="4k" disabled>
          4K
        </StickerToggleGroupItem>
      </StickerToggleGroup>

      <p className="text-sm text-muted-foreground">
        238 films by {SORTS[sort]}
        {filters.length > 0 && `, filtered by ${filters.join(" and ")}`}.
      </p>
    </div>
  );
}

import {
  StickerSkeleton,
  StickerSkeletonText,
} from "@/components/ui/sticker-skeleton";

export default function StickerSkeletonDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex items-center gap-3">
        <StickerSkeleton shape="circle" />
        <div className="flex flex-1 flex-col gap-2">
          <StickerSkeleton shape="title" delay={90} />
          <StickerSkeleton delay={180} className="w-1/2" />
        </div>
      </div>
      <StickerSkeleton shape="video" delay={270} />
      {/* One wave crosses the row left to right, so it reads as one arrival. */}
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((index) => (
          <StickerSkeleton key={index} shape="poster" delay={360 + index * 90} />
        ))}
      </div>
      <StickerSkeletonText lines={3} />
    </div>
  );
}

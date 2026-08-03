import { VideoCard } from "@/components/ui/video-card";

export default function VideoCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <VideoCard
        videoId="aqz-KE-bpKQ"
        title="Big Buck Bunny"
        channel="Blender Foundation"
        duration="10:34"
      />
      {/* href mode: the click leaves the page instead of mounting a player. */}
      <VideoCard
        videoId="aqz-KE-bpKQ"
        href="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
        title="Watch on YouTube"
        channel="Outbound, tracked, no third-party player"
        duration="10:34"
      />
    </div>
  );
}

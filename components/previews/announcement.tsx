import { Announcement } from "@/components/ui/announcement";

export default function AnnouncementDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Announcement tag="new" href="#changelog">
        Holo avatars just landed
      </Announcement>
      <Announcement>Registry mirrors sync every 15 minutes</Announcement>
    </div>
  );
}

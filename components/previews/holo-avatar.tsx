import { HoloAvatar, HoloAvatarGroup } from "@/components/ui/holo-avatar";

export default function HoloAvatarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <HoloAvatar
        size="lg"
        ring="foil"
        fallback="LM"
        alt="Lucia Moretti"
        status="online"
        statusLabel="Lucia Moretti is online"
      />
      <HoloAvatar
        size="lg"
        shape="sticker"
        ring="primary"
        fallback="KO"
        alt="Kofi Otieno"
      />
      <HoloAvatarGroup max={3}>
        <HoloAvatar ring="primary" fallback="SB" alt="Sanne Bakker" />
        <HoloAvatar ring="primary" fallback="DF" alt="Diego Ferraro" />
        <HoloAvatar ring="primary" fallback="YT" alt="Yuki Tanabe" />
        <HoloAvatar ring="primary" fallback="NR" alt="Nadia Rahmani" />
        <HoloAvatar ring="primary" fallback="TN" alt="Tomas Nowak" />
      </HoloAvatarGroup>
    </div>
  );
}

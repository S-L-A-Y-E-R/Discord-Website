import { redirect } from "next/navigation";
import axios from "axios";

import { currentProfile } from "@/lib/current-profile";
import { IProfile, IServer } from "@/types/data-types";
import ServerHeader from "@/components/server-header";

interface ServerSidbarProps {
  serverId: string;
}

export default async function ServerSidbar({ serverId }: ServerSidbarProps) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/servers/${serverId}`
  );
  const server: IServer = data.data.data;

  const textChannels = server.channels.filter(
    (channel) => channel.type === "text"
  );

  const voiceChannels = server.channels.filter(
    (channel) => channel.type === "voice"
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === "video"
  );

  const members = server.members.filter(
    (member) => !member.profileId.includes(profile._id)
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) =>
    member.profileId.includes(profile._id)
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
}

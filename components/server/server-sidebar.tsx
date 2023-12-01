import { redirect } from "next/navigation";
import axios from "axios";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { currentProfile } from "@/lib/current-profile";
import { IChannel, IMember, IProfile, IServer } from "@/types/data-types";
import ServerHeader from "@/components/server/server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidbarProps {
  serverId: string;
}

const iconMap = {
  text: <Hash className="mr-2 h-4 w-4" />,
  voice: <Mic className="mr-2 h-4 w-4" />,
  video: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap: { [key: string]: React.ReactNode } = {
  guest: null,
  moderator: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  admin: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

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

  const members = server.members;

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId._id === profile._id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 p-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel: IChannel) => ({
                  icon: iconMap.text,
                  name: channel.name,
                  id: channel._id,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: voiceChannels?.map((channel: IChannel) => ({
                  icon: iconMap.voice,
                  name: channel.name,
                  id: channel._id,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel: IChannel) => ({
                  icon: iconMap.video,
                  name: channel.name,
                  id: channel._id,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member: IMember) => ({
                  icon: roleIconMap[member.role],
                  name: member.profileId.name,
                  id: member.profileId._id,
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="text"
              label="Text Channels"
              server={server}
              role={role as "admin" | "moderator" | "guest"}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel: IChannel) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role as "admin" | "moderator" | "guest"}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!voiceChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="voice"
              label="Voice Channels"
              server={server}
              role={role as "admin" | "moderator" | "guest"}
            />
            <div className="space-y-[2px]">
              {voiceChannels.map((channel: IChannel) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role as "admin" | "moderator" | "guest"}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="video"
              label="Video Channels"
              server={server}
              role={role as "admin" | "moderator" | "guest"}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel: IChannel) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role as "admin" | "moderator" | "guest"}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              label="members"
              server={server}
              role={role as "admin" | "moderator" | "guest"}
            />
            <div className="space-y-[2px]">
              {members.map((member: IMember) => {
                if (member.role === "admin") {
                  return null;
                }
                return (
                  <ServerMember
                    key={member._id}
                    member={member}
                    server={server}
                  />
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

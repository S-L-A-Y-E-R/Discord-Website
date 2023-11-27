import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { IProfile, IMember, IChannel } from "@/types/data-types";
import ChatHeader from "@/components/chat/chat-header";

interface ChannelIdPageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/channels/${params.channelId}`
  );
  const channel: IChannel = data.data.data;

  const { data: members } = await axios.get(
    `${process.env.API_URL}api/v1/members?serverId=${params.serverId}`
  );
  const member: IMember = members.data.find(
    (member: IMember) => member.profileId[0]._id === profile._id
  );

  if (!member || !channel) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        type="channel"
        serverId={params.serverId}
      />
    </div>
  );
}

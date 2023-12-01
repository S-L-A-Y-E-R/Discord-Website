import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { IConversation, IMember, IProfile } from "@/types/data-types";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import MediaRoom from "@/components/media-room";

interface MembeIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function MemberIdPage({
  params,
  searchParams,
}: MembeIdPageProps) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { data: members } = await axios.get(
    `${process.env.API_URL}api/v1/members?serverId=${params.serverId}`
  );
  const member: IMember = members.data.find(
    (member: IMember) => member.profileId._id === profile._id
  );

  if (!member) {
    return redirect("/");
  }

  const conversation: IConversation = await getOrCreateConversation(
    member._id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const {
    memberOneId,
    memberTwoId,
  }: { memberOneId: IMember; memberTwoId: IMember } = conversation;

  const otherMember =
    memberOneId?.profileId._id === profile._id ? memberTwoId : memberOneId;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profileId.imageUrl}
        name={otherMember.profileId.name}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams?.video && (
        <MediaRoom chatId={conversation._id} video={true} audio={true} />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            member={member}
            name={otherMember.profileId.name}
            chatId={conversation._id}
            type={"conversation"}
            apiUrl={`${process.env.API_URL}api/v1/direct-messages`}
            paramKey="conversationId"
            paramValue={conversation._id}
            socketUrl={`${process.env.API_URL}api/v1/direct-messages`}
            socketQuery={{
              conversationId: conversation._id,
            }}
          />
          <ChatInput
            name={otherMember.profileId.name}
            type="conversation"
            apiUrl={`${process.env.API_URL}api/v1/direct-messages`}
            member={member}
            conversation={conversation}
          />
        </>
      )}
    </div>
  );
}

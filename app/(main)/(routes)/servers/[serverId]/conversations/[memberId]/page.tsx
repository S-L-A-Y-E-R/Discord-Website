import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { IConversation, IMember, IProfile } from "@/types/data-types";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";

interface MembeIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default async function MemberIdPage({ params }: MembeIdPageProps) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { data: members } = await axios.get(
    `${process.env.API_URL}api/v1/members?serverId=${params.serverId}`
  );
  const member: IMember = members.data.find(
    (member: IMember) => member.profileId[0]._id === profile._id
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
    memberOneId.profileId[0]._id === profile._id ? memberTwoId : memberOneId;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profileId[0].imageUrl}
        name={otherMember.profileId[0].name}
        serverId={params.serverId}
        type="conversation"
      />
      <ChatMessages
        member={member}
        name={otherMember.profileId[0].name}
        chatId={conversation._id}
        type={"conversation"}
        apiUrl={`${process.env.API_URL}api/v1/direct-messages`}
        paramKey="conversationId"
        paramValue={conversation._id}
        socketUrl={`${process.env.API_URL}api/v1/messages/socket-direct`}
        socketQuery={{
          conversationId: conversation._id,
        }}
      />
      <ChatInput
        name={otherMember.profileId[0].name}
        type="conversation"
        apiUrl={`${process.env.API_URL}api/v1/messages/socket-direct`}
        member={member}
        conversation={conversation}
      />
    </div>
  );
}

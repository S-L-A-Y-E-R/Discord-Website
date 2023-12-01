import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { IProfile, IServer } from "@/types/data-types";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/servers?inviteCode=${params.inviteCode}`
  );
  const existingServer: IServer = data.data[0];
  const serverId = existingServer?._id;

  const { data: memberOfServer } = await axios.get(
    `${process.env.API_URL}api/v1/members?serverId=${serverId}&profileId=${profile._id}`
  );

  if (memberOfServer.data[0]) {
    return redirect(`/servers/${existingServer._id}`);
  }

  const { data: member } = await axios.post(
    `${process.env.API_URL}api/v1/members`,
    {
      serverId: serverId,
      profileId: profile._id,
    }
  );

  console.log();

  await axios.patch(`${process.env.API_URL}api/v1/servers/${serverId}`, {
    profileId: [...existingServer.profileId, member.data.data.profileId],
  });

  if (member.data.data) {
    return redirect(`/servers/${serverId}`);
  }

  return null;
}

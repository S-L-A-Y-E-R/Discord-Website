import axios from "axios";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { IChannel, IProfile, IServer } from "@/types/data-types";

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

export default async function ServerIdPage({ params }: ServerPageProps) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/servers/${params.serverId}`
  );

  const server: IServer = data.data.data;

  const initialChannel: IChannel = server.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel._id}`);
}

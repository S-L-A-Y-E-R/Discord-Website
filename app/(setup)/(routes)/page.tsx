import axios from "axios";
import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { IProfile, IServer } from "@/types/data-types";
import { InitialModal } from "@/components/modals/initial-modal";

export default async function SetupPage() {
  const profile: IProfile = await initialProfile();

  let servers;
  try {
    const { data } = await axios.get(
      `${process.env.API_URL}api/v1/servers?profileId=${profile._id}`
    );
    servers = data;
  } catch (err) {
    console.log(err);
  }

  const server: IServer = servers?.data[0];

  if (server) {
    return redirect(`/servers/${server._id}`);
  }

  return <InitialModal profile={profile} />;
}

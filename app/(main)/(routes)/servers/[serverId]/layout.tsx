import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { IProfile } from "@/types/data-types";
import { IServer } from "@/types/data-types";
import ServerSidebar from "@/components/server/server-sidebar";

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/servers/${params.serverId}`
  );
  const server: IServer = data.data.data;

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full" suppressHydrationWarning>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}

import axios from "axios";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { IProfile } from "@/types/data-types";
import NavAction from "./nav-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { IServer } from "@/types/data-types";
import NavItem from "./nav-item";
import { ModeToggle } from "../toggle-theme";

export default async function NavSidebar() {
  const profile: IProfile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/servers?profileId=${profile._id}`
  );
  const servers = data.data;

  return (
    <div className="space-y-4 flex flex-col items-center h-full w-full text-primary py-3 dark:bg-[#1E1F22]">
      <NavAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server: IServer) => (
          <div key={server._id} className="mb-4">
            <NavItem
              id={server._id}
              name={server.name}
              imageurl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

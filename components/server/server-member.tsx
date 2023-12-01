"use client";

import { ShieldAlert, ShieldCheck, icons } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { IMember, IServer } from "@/types/data-types";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
  member: IMember;
  server: IServer;
}

const roleIconMap: { [key: string]: React.ReactNode } = {
  guest: null,
  moderator: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  admin: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export default function ServerMember({ member, server }: ServerMemberProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member._id}`);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member._id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profileId.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 dark:text-zinc-400 transition",
          params?.memberId === member._id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profileId.name}
      </p>
      {icon}
    </button>
  );
}

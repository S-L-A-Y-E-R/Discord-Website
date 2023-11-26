"use client";

import { Edit, Hash, Lock, LucideIcon, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { IChannel, IServer } from "@/types/data-types";
import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: IChannel;
  server: IServer;
  role: "admin" | "moderator" | "guest";
}

const iconMap: { [key: string]: LucideIcon } = {
  text: Hash,
  voice: Mic,
  video: Video,
};

export default function ServerChannel({
  channel,
  server,
  role,
}: ServerChannelProps) {
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const Icon = iconMap[channel.type];

  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={() => {}}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel._id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:first-letter:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition",
          params?.channelId === channel._id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel?.name}
      </p>
      {channel.name !== "general" && role !== "guest" && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={() => onOpen("editChannel", { channel, server })}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600
             dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteChannel", { channel, server })}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600
             dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
}

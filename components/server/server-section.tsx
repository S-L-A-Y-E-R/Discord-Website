"use client";

import { Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";

import { IServer } from "@/types/data-types";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface serverHeaderProps {
  label: string;
  role?: "admin" | "moderator" | "guest";
  sectionType: "channels" | "members";
  channelType?: "text" | "voice" | "video";
  server?: IServer;
}

export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: serverHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { onOpen } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "guest" && sectionType === "channels" && (
        <ActionTooltip label="Create channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600
           dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === "admin" && sectionType === "members" && (
        <ActionTooltip label="Manage members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600
         dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

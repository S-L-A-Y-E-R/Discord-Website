"use client";

import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export default function NavAction() {
  const [isMounted, setIsMounted] = useState(false);
  const { onOpen } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-[24px] 
        group-hover:rounded-[16px] transition-all overflow-hidden
        items-center justify-center bg-background dark:bg-emerald-700
        group-hover:bg-emerald-500"
          >
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}

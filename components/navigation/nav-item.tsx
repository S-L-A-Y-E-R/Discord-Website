"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";

interface NavItemProps {
  id: string;
  name: string;
  imageurl: string;
}

export default function NavItem({ id, name, imageurl }: NavItemProps) {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            " absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params.serverId !== id ? "group-hover:h-[20px] h-[8px]" : "h-[36px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] trasition-all overflow-hidden",
            params.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageurl} alt={"channel image"} fill />
        </div>
      </button>
    </ActionTooltip>
  );
}

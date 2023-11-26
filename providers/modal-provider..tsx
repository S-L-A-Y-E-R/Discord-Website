"use client";

import { useState, useEffect } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { IProfile } from "@/types/data-types";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MembersModal } from "@/components/modals/members-modal";

export default function ModalProvider({ profile }: { profile: IProfile }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal profile={profile} />
      <InviteModal profile={profile} />
      <EditServerModal profile={profile} />
      <MembersModal profile={profile} />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { IProfile } from "@/types/data-types";

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
    </>
  );
}

"use client";

import { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMember, IProfile } from "@/types/data-types";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const LeaveServerModal = ({ profile }: { profile: IProfile }) => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;
  const memberId = server?.members.find(
    (member: IMember) => member.profileId[0]._id === profile?._id
  )?._id;

  const onLeaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`${process.env.API_URL}api/v1/servers/${server?._id}`, {
        profileId: server?.profileId.filter((id) => id !== profile?._id),
      });
      await axios.delete(`${process.env.API_URL}api/v1/members/${memberId}`);
      router.refresh();
      router.push("/");
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"primary"}
              onClick={onLeaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import qs from "query-string";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMember, IProfile } from "@/types/data-types";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { url } from "inspector";
import { useRouter } from "next/navigation";

const roleIconMap: { [key: string]: JSX.Element | null } = {
  guest: null,
  moderator: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  admin: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const MembersModal = ({ profile }: { profile: IProfile }) => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setIsLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data;

  const onKick = async (memberId: string, member: IMember) => {
    try {
      setIsLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `${process.env.API_URL}api/v1/members/${memberId}`,
      });
      await axios.delete(url);
      const { data: newServer } = await axios.patch(
        `${process.env.API_URL}api/v1/servers/${server!._id}`,
        {
          profileId: server?.profileId.filter(
            (id) => id !== member.profileId[0]._id
          ),
        }
      );
      router.refresh();
      onOpen("members", { server: newServer.data.data });
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingId("");
    }
  };

  const onRoleChange = async (
    memberId: string,
    role: "admin" | "moderator" | "guest"
  ) => {
    try {
      setIsLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `${process.env.API_URL}api/v1/members/${memberId}`,
      });
      const { data } = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: data.data.data });
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member: IMember) => (
            <div key={member._id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profileId[0].imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profileId[0].name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">
                  {member.profileId[0].email}
                </p>
              </div>
              {server.profileId[0] !== member.profileId[0]._id &&
                loadingId !== member._id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member._id, "guest")
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "guest" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member._id, "moderator")
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "moderator" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member._id, member)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member._id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

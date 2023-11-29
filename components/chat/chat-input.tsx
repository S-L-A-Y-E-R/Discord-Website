"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { IChannel, IConversation, IMember } from "@/types/data-types";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../emoji-picker";

interface ChatInputProps {
  apiUrl: string;
  name: string;
  type: "channel" | "conversation";
  member?: IMember;
  channel?: IChannel;
  conversation?: IConversation;
}

const schema = z.object({
  content: z.string().trim().min(1),
  memberId: z.string().optional(),
  channelId: z.string().optional(),
  conversationId: z.string().optional(),
});

export default function ChatInput({
  apiUrl,
  name,
  type,
  member,
  channel,
  conversation,
}: ChatInputProps) {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      memberId: member?._id,
      channelId: channel?._id,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      values.memberId = member?._id;
      values.channelId = channel?._id;
      values.conversationId = conversation?._id;
      const url = qs.stringifyUrl({ url: apiUrl });
      await axios.post(url, values);
      form.reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen("messageFile", { apiUrl, memberId: member?._id })
                    }
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 rounded-full
                     dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition
                     p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600
                    border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0
                    dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

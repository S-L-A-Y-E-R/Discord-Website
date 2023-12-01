import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import { useSocket } from "@/providers/socket-provider";

interface UseChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: UseChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = 1 }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          [paramKey]: paramValue,
          page: pageParam,
        },
      },
      { skipNull: true }
    );

    const { data } = await axios.get(url);
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => {
        return lastPage.data.data.length > 0 && lastPage.data.data.length >= 10
          ? +lastPage.page + 1
          : undefined;
      },
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: 1,
      enabled: true,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

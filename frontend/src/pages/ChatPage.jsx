// ChatPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/userAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserById } from "../lib/api";
import AIMessageComposer from "../components/AIMessageComposer";

import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageComposer,
  Thread,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  console.log(targetUserId)

  const { data: targetUser } = useQuery({
  queryKey: ["user", targetUserId],
  queryFn: () => getUserById({id: targetUserId}),
  enabled: !!targetUserId,
});

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      console.log(targetUserId)

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    // Height-constrained on EVERY breakpoint, using dvh (safe on mobile
    // browsers where the address bar changes the viewport height).
    // Adjust the offset (e.g. 7vh/11vh) to match your navbar's actual height.
    <div className="h-[93dvh] h-[93vh] w-full overflow-hidden">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          {/* Window is the flex column that owns the whole chat area */}
          <Window>
            <div className="flex flex-col h-full w-full bg-base-100">
              {/* HEADER — fixed height, never shrinks/scrolls */}
              <div className="flex items-center gap-2 sm:gap-3 border-b border-base-300 px-2 sm:px-4 py-2 shrink-0">
                <CallButton handleVideoCall={handleVideoCall} />
                <div className="flex-1 min-w-0">
                  <ChannelHeader />
                </div>
              </div>

              {/* MESSAGE LIST — the ONLY scrollable region, on every breakpoint */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <MessageList />
              </div>

              {/* COMPOSER AREA — fixed height, pinned at bottom of the flex column,
                  respects the iOS home-indicator safe area */}
              <div className="shrink-0 border-t border-base-300 bg-base-100 pb-[env(safe-area-inset-bottom)]">
                <AIMessageComposer targetUser={targetUser}/>
                <MessageComposer focus />
              </div>
            </div>
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
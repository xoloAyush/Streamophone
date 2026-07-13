import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {

      toast.success("Friend request accepted");

      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incoming || [];
  const acceptedRequests = friendRequests?.accepted || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl  space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 justify-between">
                            <div className="avatar w-14 h-14 rounded-full gap-4 bg-base-300 flex overflow-hidden justify-center">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} />
                            </div>
                            <div className="flex gap-4">
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn1 btn1-active btn1-sm p-2 rounded-xs flex justify-center cursor-pointer"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

               <div className="space-y-4">
  {acceptedRequests.map((notification) => (
    <div
      key={notification._id}
      className="card bg-base-200 shadow-md hover:shadow-lg transition-all"
    >
      <div className="card-body p-5">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-center">

          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img
                  src={notification.sender.profilePic}
                  alt={notification.sender.fullName}
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">
              {notification.sender.fullName}
            </h3>

            <p className="text-sm text-base-content/70">
              <span className="font-medium">Bio:</span>{" "}
              {notification.sender.bio}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-base-content/60">
              <ClockIcon className="w-4 h-4" />
              Recently
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center md:justify-end">
            <div className="badge badge-success badge-lg gap-2">
              <MessageSquareIcon className="w-4 h-4" />
              New Friend
            </div>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
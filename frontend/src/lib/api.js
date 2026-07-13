// const BASE_URL = "https://jsonplaceholder.typicode.com";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api"

export const fetchInstance = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include", // same as axios withCredentials: true
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Something went wrong");
  }

  return res.json();
};

export const completeOnboarding = async (authUser) => {
    
            const response = await fetchInstance("/auth/onBoarding", {
            method: "POST",
            body: JSON.stringify(authUser),
          });

          return response.user
        }

export const getUserFriends = async () => {
    
            const response = await fetchInstance("/user/friends", {
            method: "GET",
          });

          return response.friends
        }

export const getRecommendedUsers = async () => {
    
            const response = await fetchInstance("/user/recommended", {
            method: "GET",
          });

          return response.users
        }

export const getOutgoingFriendReqs = async () => {
    
            const response = await fetchInstance("/user/outgoing-friend-requests", {
            method: "GET",
          });

          return response
        }       

export async function sendFriendRequest(userId) {
  const response = await fetchInstance(`/user/friend-request/${userId}`,{
    method: "POST"
  });

  return response;
}

export async function getFriendRequests() {
  const response = await fetchInstance("/user/friend-requests",{
    method: 'GET'
  });
  return response;
}

export async function acceptFriendRequest(requestId) {
  const response = await fetchInstance(`/user/friend-request/${requestId}/accept`,{
    method: 'PUT'
  });
  return response;
}

export async function getStreamToken() {
  const response = await fetchInstance(`/chat/token/`,{
    method: 'GET'
  });
  return response;
}

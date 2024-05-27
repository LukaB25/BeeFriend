import { useFriendRequestData } from "../contexts/FriendRequestContext";

const useFriendRequestAction = () => {
  // Custom hook to handle friend request actions and provide them to the rest of the application
  const {
    sentFriendRequests,
    receivedFriendRequests,
    acceptedFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    denyFriendRequest,
  } = useFriendRequestData();
  
  const handleSendFriendRequest = async (clickedProfile) => {
    if (!clickedProfile) return;
    await sendFriendRequest(clickedProfile);
  }

  const handleAcceptFriendRequest = async (id) => {
    await acceptFriendRequest(id);
  }

  const handleDenyFriendRequest = async (id) => {
    await denyFriendRequest(id);
  }

  return {
    sentFriendRequests,
    receivedFriendRequests,
    acceptedFriendRequests,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleDenyFriendRequest,
  }
}

export default useFriendRequestAction;

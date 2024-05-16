import { useFriendRequestData } from "../contexts/FriendRequestContext";

const useFriendRequestAction = () => {
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
    console.log('clickedProfile: ', clickedProfile);
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

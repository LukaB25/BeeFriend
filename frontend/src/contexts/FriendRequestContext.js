import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { getCurrentUserFromLocalStorage } from "../utils/utils";


const FriendRequestContext = createContext();

export const useFriendRequestData = () => useContext(FriendRequestContext);

export const FriendRequestProvider = ({ children }) => {
  const currentUser = getCurrentUserFromLocalStorage();
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
  const [acceptedFriendRequests, setAcceptedFriendRequests] = useState([]);


  useEffect(() => {
    const  fetchFriendRequests = async () => {
      try {
        const [{data: sentFriendRequests}, {data: receivedFriendRequests}, { data: acceptedFriendRequests }] = await Promise.all([
          axiosReq.get('/friends/', { params: {
            owner: currentUser?.profile_id,
            accepted: false,
          } }),
          axiosReq.get('/friends/', { params: {
            friend: currentUser?.profile_id,
            accepted: false,
          } }),
          axiosReq.get('/friends/', { params: {
            accepted: true,
          } }),
        ]);
        setSentFriendRequests(sentFriendRequests);
        setReceivedFriendRequests(receivedFriendRequests);
        setAcceptedFriendRequests(acceptedFriendRequests);
        console.log("sent", sentFriendRequests.results)
        console.log("received", receivedFriendRequests.results)
        console.log("accepted", acceptedFriendRequests.results)
      } catch (err) {
        console.log('Error', err);
      };
    };
    fetchFriendRequests();
  }, [currentUser?.profile_id]);

  const sendFriendRequest = async (clickedProfile) => {
    try {
      const { data } = await axiosReq.post('/friends/', {
        friend: clickedProfile,
        owner: currentUser?.id,
      });
      setSentFriendRequests([...data, data]);
    } catch (err) {
      console.log(err);
    }
  }

  const acceptFriendRequest = async (id) => {
    try {
      const { data } = await axiosReq.put(`/friends/${id}/`, { accepted: true });
      setAcceptedFriendRequests(...data, data);
      setReceivedFriendRequests(data => data(request => request.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  const denyFriendRequest = async (id) => {
    try {
      await axiosReq.delete(`/friends/${id}/`);
      setReceivedFriendRequests(prevState => prevState(request => request.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <FriendRequestContext.Provider
      value={{sentFriendRequests,
      receivedFriendRequests,
      acceptedFriendRequests,
      acceptFriendRequest,
      sendFriendRequest,
      denyFriendRequest}}
    >
      {children}
    </FriendRequestContext.Provider>
  )
}
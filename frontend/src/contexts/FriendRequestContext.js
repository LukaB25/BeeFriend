import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";
import { toast } from "react-toastify";


const FriendRequestContext = createContext();
const SetFriendRequestContext = createContext();

export { FriendRequestContext, SetFriendRequestContext };

export const useFriendRequestData = () => useContext(FriendRequestContext);
export const useSetFriendRequestData = () => useContext(SetFriendRequestContext);

export const FriendRequestProvider = ({ children }) => {
  const currentUser = useCurrentUser();
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
      } catch (err) {
        toast.error('Error fetching friend requests');
      };
    };
    fetchFriendRequests();
  }, [currentUser]);

  const sendFriendRequest = async (clickedProfile) => {
    try {
      const { data } = await axiosReq.post('/friends/', {
        friend: clickedProfile,
        owner: currentUser?.profile_id,
      });
      setSentFriendRequests(prevState => ({
        ...prevState,
        results: [...prevState.results, data]
      }));
    } catch (err) {
      toast.error(`Error sending friend request. ${err.response?.data}`);
    }
  }

  const acceptFriendRequest = async (id) => {
    try {
      const { data } = await axiosReq.put(`/friends/${id}/`, {
        friend: currentUser?.profile_id,
        accepted: true
      });
      setAcceptedFriendRequests(prevState => ({
        ...prevState,
        results: [...prevState.results, data]
      }));
      setReceivedFriendRequests(prevState => ({
        ...prevState,
        results: [prevState.results.filter(request => request.id !== id)]
      }));
      setSentFriendRequests(prevState => ({
        ...prevState,
        results: [prevState.results.filter(request => request.id !== id)]
      }));
    } catch (err) {
      toast.error(`Error accepting friend request. ${err.response?.data}`);
    }
  }

  const denyFriendRequest = async (id) => {
    try {
      await axiosReq.delete(`/friends/${id}/`);
      setReceivedFriendRequests(prevState => ({
        ...prevState,
        results: prevState.results.filter(request => request.id !== id)
      }));
      setSentFriendRequests(prevState => ({
        ...prevState,
        results: prevState.results.filter(request => request.id !== id)
      }));
      setAcceptedFriendRequests(prevState => ({
        ...prevState,
        results: prevState.results.filter(request => request.id !== id)
      }));
    } catch (err) {
      toast.error(`Error denying friend request. ${err.response?.data}`);
    }
  }

  return (
    <FriendRequestContext.Provider
      value={{sentFriendRequests,
      receivedFriendRequests,
      acceptedFriendRequests,
      acceptFriendRequest,
      sendFriendRequest,
      denyFriendRequest,
    }}
    >
      <SetFriendRequestContext.Provider value={{setSentFriendRequests, setAcceptedFriendRequests, setReceivedFriendRequests}}>
        {children}
      </SetFriendRequestContext.Provider>
    </FriendRequestContext.Provider>
  )
}
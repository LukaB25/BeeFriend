import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";
import { toast } from "react-toastify";

const FriendDataContext = createContext();
const SetFriendDataContext = createContext();

export { FriendDataContext, SetFriendDataContext };

export const useFriendData = () => useContext(FriendDataContext);
export const useSetFriendData = () => useContext(SetFriendDataContext);

export const FriendDataProvider = ({ children }) => {
  // FriendDataProvider context used to fetch and store friend data
  // and provide it to the rest of the application
  const [friendsData, setFriendsData] = useState({
    friends: { results: [] },
  });

  const currentUser = useCurrentUser();

    useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await axiosReq.get(`/friends/?accepted=true`);
        setFriendsData({
          friends: data
        });
      } catch (err) {
        toast.error('Error fetching friends data')
      }
    };

    fetchFriends();
  }, [currentUser])



    return (
      <FriendDataContext.Provider value={{friendsData}}>
          <SetFriendDataContext.Provider value={{setFriendsData}}>
              {children}
          </SetFriendDataContext.Provider>
      </FriendDataContext.Provider>
    )
  };

  
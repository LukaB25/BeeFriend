import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

const FriendDataContext = createContext();
const SetFriendDataContext = createContext();

export { FriendDataContext, SetFriendDataContext };

export const useFriendData = () => useContext(FriendDataContext);
export const useSetFriendData = () => useContext(SetFriendDataContext);

export const FriendDataProvider = ({ children }) => {
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
        // const friends = data.results.filter(
        //   friend => currentUser?.profile_id === friend.friend ||
        //   currentUser?.profile_id === friend.owner_profile_id
        // ).map(friend => friend.friend === currentUser?.profile_id ? friend.owner_profile_id : friend.friend);
        // console.log('Friends from data context:', friends)
      } catch (err) {
        console.log('Error fetching friends data:', err.data)
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

  
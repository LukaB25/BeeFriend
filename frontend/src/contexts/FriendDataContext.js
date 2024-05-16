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
        const { data } = await axiosReq.get(`/friends/`);
        setFriendsData({
          friends: data
        });
        console.log('friends', data?.results)
      } catch (err) {
        console.log(err)
      }
    }

    fetchFriends();
  }, [currentUser])


    return (
      <FriendDataContext.Provider value={friendsData}>
          <SetFriendDataContext.Provider value={setFriendsData}>
              {children}
          </SetFriendDataContext.Provider>
      </FriendDataContext.Provider>
    )
  };

  
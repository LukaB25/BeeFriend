import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export { ProfileDataContext, SetProfileDataContext };

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    recommendedProfiles: { results: [] },
  });
  
  const currentUser = useCurrentUser();
   
    useEffect(() => {
      const handleMount = async () => {
        try {
          const { data } = await axiosReq.get(
            "/profiles/?ordering=-post_interaction_count/"
          );
          setProfileData((prevState) => ({
            ...prevState,
            recommendedProfiles: data,
          }));
        } catch (err) {
          console.log(err);
        }
      };
      handleMount();
    }, [currentUser]);
    return (
      <ProfileDataContext.Provider value={profileData}>
          <SetProfileDataContext.Provider value={setProfileData}>
              {children}
          </SetProfileDataContext.Provider>
      </ProfileDataContext.Provider>
    )
  };

  
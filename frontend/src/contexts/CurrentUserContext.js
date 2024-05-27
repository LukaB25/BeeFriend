import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import { removeCurrentUserFromLocalStorage, removeTokenTimestamp, setCurrentUserInLocalStorage, shouldRefreshToken } from '../utils/utils';

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({children}) => {
  // CurrentUserProvider context used to fetch and store the current user data
  // and provide it to the rest of the application
  // Manages the current user data by storing and updating the current user
  // on login and logout
  const [currentUser, setCurrentUser] = useState(null);

  const history = useHistory();

  const handleMount = async () => {
    try { const {data} = await axiosRes.get('/dj-rest-auth/user/');
    setCurrentUser(data);
    setCurrentUserInLocalStorage(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setCurrentUser(null);
        removeCurrentUserFromLocalStorage();
      } else {
        toast.error('You are not logged in!');
    }
  }}

  useEffect(() => {
    handleMount();

    return () => {
      setCurrentUser(null);
      setCurrentUserInLocalStorage(null);
    }
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if(shouldRefreshToken()) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push('/login');
              }
              return null;
            })
            removeTokenTimestamp();
            removeCurrentUserFromLocalStorage();
            return config;
          }
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    )
    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
          } catch (err) {
            setCurrentUser(prevCurrentUser => {
              if (prevCurrentUser){
                history.push('/login');
              }
              return null;
            });
            removeTokenTimestamp();
            removeCurrentUserFromLocalStorage();
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    )
  }, [history])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  )
}
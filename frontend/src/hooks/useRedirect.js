import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const useRedirect = (userAuthStatus) => {
  // Redirect hook to redirect users to the home page if they are logged in
  // or logged out
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/")
        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          history.push('/')
        }
      } catch (err) {
        if (userAuthStatus === "loggedOut") {
          history.push('/')
        }
      }
    }
    handleMount()
  }, [history, userAuthStatus])
}
import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";
import { toast } from "react-toastify";

export const fetchMoreData = async (resource, setResource) => {
  // Fetch more data from the next url in the resource object
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
        ? acc
        : [...acc, cur]
      }, prevResource.results)
    }))
  } catch (err) {
    toast.error(`Error fetching more data.`);
  }
}

export const fetchMoreMessages = async (chatId, resource, setMessages) => {
  // Fetch more messages from the next url in the resource object
  try {
    const { data } = await axiosReq.get(resource.next);
    setMessages((prevState) => ({
      ...prevState,
      [chatId]: {
        ...prevState[chatId],
        results: [...prevState[chatId].results, ...data.results],
        next: data.next
      }
    }));
  } catch (err) {
    console.error("Error fetching more messages:", err);
  }
};

export const setTokenTimestamp = (data) => {
  // Set the token timestamp in local storage
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  // Check if the token should be refreshed
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  // Remove the token timestamp from local storage
  localStorage.removeItem("refreshTokenTimestamp");
};

export const setCurrentUserInLocalStorage = (data) => {
  // Set the current user in local storage
  const currentUserString = JSON.stringify(data);
  localStorage.setItem("currentUser", currentUserString);
};

export const getCurrentUserFromLocalStorage = () => {
  // Get the current user from local storage
  const currentUserString = localStorage.getItem("currentUser");
  return currentUserString ? JSON.parse(currentUserString) : null;
};

export const removeCurrentUserFromLocalStorage = () => {
  // Remove the current user from local storage
  localStorage.removeItem("currentUser");
};

import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
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
    console.log(err);
  }
}

export const fetchMoreMessages = async (chatId, resource, setMessages) => {
  try {
    console.log('Fetching more messages from:', resource.next);
    const { data } = await axiosReq.get(resource.next);
    console.log('Fetched more messages:', data.results);

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
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};

export const setCurrentUserInLocalStorage = (data) => {
  const currentUserString = JSON.stringify(data);
  localStorage.setItem("currentUser", currentUserString);
};

export const getCurrentUserFromLocalStorage = () => {
  const currentUserString = localStorage.getItem("currentUser");
  return currentUserString ? JSON.parse(currentUserString) : null;
};

export const removeCurrentUserFromLocalStorage = () => {
  localStorage.removeItem("currentUser");
};

export const saveMessageToLocalStorage = (message) => {
  localStorage.setItem("typedMessage", message);
}

export const getMessageFromLocalStorage = () => {
  return localStorage.getItem("typedMessage");
}

export const removeMessageFromLocalStorage = () => {
  localStorage.removeItem("typedMessage");
}

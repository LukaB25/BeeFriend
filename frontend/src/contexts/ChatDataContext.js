import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";
import { toast } from "react-toastify";

const ChatDataContext = createContext();
const SetChatDataContext = createContext();

export { ChatDataContext, SetChatDataContext };

export const useChatData = () => useContext(ChatDataContext);
export const useSetChatData = () => useContext(SetChatDataContext);

export const ChatDataProvider = ({ children }) => {
  const currentUser = useCurrentUser();
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState({});
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axiosReq.get('/chats/');
        setChat(data);
      } catch (err) {
        toast.error(`Error fetching chats. ${err.response?.data}`);
      }
    };

    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const { data } = await axiosReq.get(`/chats/${chatId}/messages/`);
      setMessages((prevState) => ({
        ...prevState,
        [chatId]: data,
      }));
    } catch (err) {
      toast.error(`Error fetching messages. ${err.response?.data}`);
    }
  }, []);

  const sendMessage = async (chatId, message) => {
    if (!chatId || !message) {
      toast.error('Chat ID or message is missing');
      console.log('Chat ID or message is missing');
      return;
    }
    try {
      const { data } = await axiosReq.post(`/chats/${chatId}/messages/`, { 
        message: message,
        sender: currentUser?.username,
        receiver: chatId?.receiver === currentUser?.username ? chatId?.sender : chatId?.receiver,
      });
      setMessages((prevState) => ({
        ...prevState,
        [chatId]: Array.isArray(prevState[chatId]) ? [...prevState[chatId], data] : [data],
      }));
    } catch (err) {
      toast.error(`Error sending message ${err.response?.data}`);
    }
  };



  return (
    <ChatDataContext.Provider value={{ chat, messages }}>
      <SetChatDataContext.Provider value={{ fetchMessages, sendMessage, setMessages }}>
        {children}
      </SetChatDataContext.Provider>
    </ChatDataContext.Provider>
  );
};

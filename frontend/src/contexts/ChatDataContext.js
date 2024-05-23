import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

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
        console.log('Chat error:', err.response?.data);
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
      console.log('Fetched messages:', data?.results);
    } catch (err) {
      console.log('Messages error:', err.response?.data);
    }
  }, []);

  const sendMessage = async (chatId, message) => {
    if (!chatId || !message) {
      console.log('Chat ID or message is missing');
      return;
    } else {
      console.log('Sent message is:', message)
      console.log('Selected chat is:', chatId)
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
      console.log('Sent message:', data?.message);
    } catch (err) {
      console.log('Send message error:', err.response?.data);
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

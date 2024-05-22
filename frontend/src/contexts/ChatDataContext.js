import { createContext, useContext, useEffect, useState } from "react";
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
  const [messages, setMessages] = useState([]);
  

  // console.log('Current user in chat data provider:', currentUser);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axiosReq.get('/chats/');
        setChat(data);
      } catch (err) {
        console.log('Chat error:', err.response?.data);
      }
    };

    fetchChats();
  }, [currentUser]);

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axiosReq.get(`/chats/${chatId}/messages/`);
      setMessages((prevState) => ({
        ...prevState,
        [chatId]: data,
      }));
      console.log('Fetched messages:', data);
    } catch (err) {
      console.log('Messages error:', err.response?.data);
    }
  };

  const sendMessage = async (chatId, message) => {
    try {
      const { data } = await axiosReq.post(`/chats/${chatId}/messages/`, { message });
      setMessages((prevState) => ({
        ...prevState,
        [chatId]: [...(prevState[chatId] || []), data],
      }));
      console.log('Sent message:', data?.message);
    } catch (err) {
      console.log('Send message error:', err.response?.data);
    }
  };

  return (
    <ChatDataContext.Provider value={{ chat, messages }}>
      <SetChatDataContext.Provider value={{ fetchMessages, sendMessage }}>
        {children}
      </SetChatDataContext.Provider>
    </ChatDataContext.Provider>
  );
};

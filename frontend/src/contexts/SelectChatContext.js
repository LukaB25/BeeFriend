import { createContext, useContext, useState } from "react";

const SelectedChatContext = createContext();
const SetSelectedChatContext = createContext();

export { SelectedChatContext, SetSelectedChatContext };

export const useSelectedChat = () => useContext(SelectedChatContext);
export const useSetSelectedChat = () => useContext(SetSelectedChatContext);

export const SelectedChatProvider = ({ children }) => {
  // Manages selected chat data and provides it to the rest of the application
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <SelectedChatContext.Provider value={selectedChat}>
      <SetSelectedChatContext.Provider value={setSelectedChat}>
        {children}
      </SetSelectedChatContext.Provider>
    </SelectedChatContext.Provider>
  )
}
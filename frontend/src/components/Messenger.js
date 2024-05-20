import React, { useEffect, useState } from 'react';
import { useSelectedChat, useSetSelectedChat } from '../contexts/SelectChatContext';
import { useChatData, useSetChatData } from '../contexts/ChatDataContext';

import {
  saveMessageToLocalStorage,
  getMessageFromLocalStorage,
  removeMessageFromLocalStorage,
  getCurrentUserFromLocalStorage
} from '../utils/utils';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import styles from '../styles/PostsPage.module.css';
import chatStyles from '../styles/Chat.module.css';
import btnStyles from '../styles/Button.module.css';
import appStyles from '../App.module.css';

import Asset from './Asset';
import Avatar from './Avatar';
import MessageForm from './MessageForm';


const Messenger = ({ mobile }) => {
  const currentUser = getCurrentUserFromLocalStorage();
  const selectedChat = useSelectedChat();
  const setSelectedChat = useSetSelectedChat();
  const { messages } = useChatData();
  const { fetchMessages } = useSetChatData();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

  console.log('Messages:', messages);
  console.log('Selected chat:', selectedChat);
  console.log('Current user:', currentUser);


  useEffect(() => {
    if (selectedChat) {
      setHasLoaded(false);
      fetchMessages(selectedChat).then(() => setHasLoaded(true))
    }
  }, [selectedChat]);


  useEffect(() => {
    const intervalTimer = setInterval(() => {
      saveMessageToLocalStorage(typedMessage);
      if (selectedChat) {
        fetchMessages(selectedChat).then(() => setHasLoaded(true))
      }
    }, 300000); // 5 minutes interval

    return () => {
      setTypedMessage(getMessageFromLocalStorage());
      removeMessageFromLocalStorage();
      clearInterval(intervalTimer);
    }
  }, [selectedChat, fetchMessages, typedMessage]);

  const handleExitChat = () => {
    setSelectedChat(null);
  };  
  return (
    currentUser && selectedChat ? (
    <Container className={`${appStyles.Content} ${styles.SmallComponent}
    ${styles.LargeScreen} text-center d-flex flex-column`} 
    >
      <div className="d-flex justify-content-center align-items-center">
        <h4 className={chatStyles.MessengerHeader}>Messenger</h4>
        <Button
          onClick={handleExitChat}
          className={`${btnStyles.Button}
          ${btnStyles.CloseButton} ${btnStyles.HexButton}
          ml-auto`}>
            <i className="fas fa-times" />
        </Button>
        </div>
          {hasLoaded ? (
            <React.Fragment>
            <div className={chatStyles.Messages}>
              {messages?.results?.length === 0 ? (
              (messages?.results?.map((message) => (
                <div
                  key={message?.id}
                  className={`text-left ${message.sender === currentUser.username ? chatStyles.SentMessage : chatStyles.ReceivedMessage}`}
                >
                  <Avatar
                    src={message?.receiver_username === currentUser?.username ?
                    message?.sender_image : message?.receiver_image}
                    height={35} width={40}
                  />
                  <p>{message?.message}</p>
                </div>
              )))
            ) : (
                  <p>You have no messages with this user... yet</p>
              )}
            </div>
            <div className={`mt-auto ${chatStyles.MessageForm}`}>
              <MessageForm typedMessage={typedMessage} setTypedMessage={setTypedMessage} />
            </div>
            </React.Fragment>
          ) : (
            <Asset spinner />
          )}
    </Container>

    ) : null
  )
}

export default Messenger

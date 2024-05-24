import React, { useCallback, useEffect, useState } from 'react';
import { useSelectedChat, useSetSelectedChat } from '../contexts/SelectChatContext';
import { useChatData, useSetChatData, } from '../contexts/ChatDataContext';
import { fetchMoreMessages, getCurrentUserFromLocalStorage } from '../utils/utils';
import InfiniteScroll from 'react-infinite-scroll-component';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import styles from '../styles/PostsPage.module.css';
import chatStyles from '../styles/Chat.module.css';
import btnStyles from '../styles/Button.module.css';
import appStyles from '../App.module.css';

import Asset from './Asset';
import Avatar from './Avatar';
import MessageForm from './MessageForm';


const Messenger = ({ InboxPage }) => {
  const currentUser = getCurrentUserFromLocalStorage();
  const selectedChat = useSelectedChat();
  const setSelectedChat = useSetSelectedChat();
  const { messages } = useChatData();
  const { fetchMessages, setMessages } = useSetChatData();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const chatData = useChatData();

  const chat = chatData?.chat?.results.find(chat => chat.id === selectedChat);

  const fetchCallback = useCallback(async (chatId) => {
    setHasLoaded(false);
    await fetchMessages(chatId);
    setHasLoaded(true);
  }, [fetchMessages]);

  useEffect(() => {
    if (selectedChat) {
      fetchCallback(selectedChat);
    };
  }, [selectedChat, fetchCallback]);

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      if (selectedChat) {
        fetchCallback(selectedChat);
      }
    }, 300000); // 5 minutes interval

    return () => {
      clearInterval(intervalTimer);
    }
  }, [selectedChat, fetchCallback]);

  const handleExitChat = () => {
    setSelectedChat(null);
  };

  return (
    currentUser && selectedChat ? (
      <Container className={`${appStyles.Content} ${styles.SmallComponent}
        ${styles.LargeScreen} ${chatStyles.MessengerComponent}
        ${InboxPage && chatStyles.SmallDeviceInbox}
        text-center d-flex flex-column`}
      >
        <div className="d-flex justify-content-center align-items-center">
          <Avatar
            src={chat?.receiver_username === currentUser?.username ?
              chat?.sender_image : chat?.receiver_image}
            height={35} width={40}
          />
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
            <div key={"chat" + selectedChat} className={chatStyles.Messages}>
              {messages[selectedChat]?.results?.length > 0 ? (
                <InfiniteScroll
                  children={
                    (messages[selectedChat]?.results?.map((message) => (
                      <div
                        key={message?.id}
                        className={`text-left d-flex
                        ${message?.sender === currentUser?.username ?
                            chatStyles.SentMessage : chatStyles.ReceivedMessage
                          }`}
                      >
                        <p>{message?.message}</p>
                        <small className="text-right">{message?.created_at}</small>
                      </div>
                    )))
                  }
                  dataLength={messages[selectedChat]?.results?.length || 0}
                  loader={<Asset spinner />}
                  hasMore={!!messages[selectedChat]?.next}
                  next={() => fetchMoreMessages(selectedChat, messages[selectedChat], setMessages)}
                />
              ) : (
                <p>You have no messages with this user... yet</p>
              )}
            </div>
            <div className={`mt-auto ${chatStyles.MessageForm}`}>
              <MessageForm typedMessage={typedMessage} setTypedMessage={setTypedMessage} fetchCallback={fetchCallback} />
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

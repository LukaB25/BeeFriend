import React, { useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import { useChatData, useSetChatData } from '../contexts/ChatDataContext';
import { useProfileData } from '../contexts/ProfileDataContext';
import { getCurrentUserFromLocalStorage } from '../utils/utils';

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';

import styles from '../styles/PostsPage.module.css';
import chatStyles from '../styles/Chat.module.css';
import btnStyles from '../styles/Button.module.css';
import appStyles from '../App.module.css';

import Asset from './Asset';
import noResults from '../assets/no_results.png';
import Avatar from './Avatar';
import { useSetSelectedChat } from '../contexts/SelectChatContext';
import { MessageDropdown } from './MoreDropdown';

const Inbox = ({ InboxPage }) => {
  const { chat } = useChatData();
  const { setChat } = useSetChatData();
  const [query, setQuery] = useState('');
  const currentUser = getCurrentUserFromLocalStorage();
  const profileData = useProfileData();
  const setSelectedChat = useSetSelectedChat();
  const profiles = profileData?.recommendedProfiles?.results;

  const matchProfileToQuery = profiles.find(profile => profile.owner === query);

  const handleDelete = async (chatId) => {
    try {
      await axiosReq.delete(`/chats/${chatId}/`);
      const { data } = await axiosReq.get('/chats/');
      setChat(data);
    } catch (err) {
      console.log(err);
    }
  }

  const existingChats = (
    <ListGroup>
      {chat?.results?.length ? (
      chat.results.map((chat) => (
        <OverlayTrigger key={chat?.id} placement="top" overlay={<Tooltip>Chat with {chat?.receiver_username === currentUser?.username ? chat?.sender : chat?.receiver_username}</Tooltip>}>
            <ListGroup.Item
              onClick={() => setSelectedChat(chat?.id)}
              className={`d-flex text-left ${chatStyles.ChatItem}`}
            >
              <Avatar
                src={chat?.receiver_username === currentUser?.username ?
                chat?.sender_image : chat?.receiver_image}
                height={35} width={40}
              />
              <strong className="ml-2">
                {chat?.receiver_username === currentUser?.username ?
                chat?.sender : chat?.receiver_username}
              </strong>
            <MessageDropdown handleDelete={() => handleDelete(chat?.id)} />
            </ListGroup.Item>
          </OverlayTrigger>
        ))
      ) : (
        <p>You have no chats... yet</p>
      )}
    </ListGroup>
  );

  const handleStartNewChat = async (event) => {
    event.preventDefault();
    if (matchProfileToQuery) {
      try {
        const { data } = await axiosReq.post('/chats/', { receiver: matchProfileToQuery.id });
        setSelectedChat(data.id);

        const { data: updatedChatData } = await axiosReq.get('/chats/');
        setChat(updatedChatData);
      } catch(err) {
        console.log("Error starting new chat:", err);
      }
    } else {
      console.log("No user found with the id:", query);
    }
  };
  
  return (
    <Container className={`${appStyles.Content} ${styles.SmallComponent}
    ${styles.LargeScreen} ${InboxPage && chatStyles.SmallDeviceInbox} text-center`} 
    >
      <h4>Inbox</h4>
        {currentUser ? (
          <React.Fragment>
          <Form className={`d-flex ${styles.SearchBar}`}>
          <OverlayTrigger placement="top" overlay={<Tooltip>Type in a username and click Chat, to create a new chat.</Tooltip>}>
            <Form.Control
              type="text"
              placeholder="Find user"
              name="newChat"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onSubmit={(event) => handleStartNewChat(event)}
            />
          </OverlayTrigger>
          <Button
            onClick={handleStartNewChat}
            className={`${btnStyles.Button} ${btnStyles.FormButton} ${btnStyles.NewPostButton} mb-3`}
          >
            Chat
          </Button>
        </Form>
        {existingChats}
      </React.Fragment>
      ) : (
        <Asset src={noResults} message="Log in to see your inbox!" />
      )}
    </Container>
  )
}

export default Inbox;

import React, { useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import { useChatData } from '../contexts/ChatDataContext';
import { useProfileData } from '../contexts/ProfileDataContext';
import { getCurrentUserFromLocalStorage } from '../utils/utils';

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';

import styles from '../styles/PostsPage.module.css';
import btnStyles from '../styles/Button.module.css';
import appStyles from '../App.module.css';

import Asset from './Asset';
import noResults from '../assets/no_results.png';
import Avatar from './Avatar';

const Inbox = ({ mobile, selectChat }) => {
  const chatData = useChatData();
  const [query, setQuery] = useState('');
  const currentUser = getCurrentUserFromLocalStorage();
  const profileData = useProfileData();
  const profiles = profileData?.recommendedProfiles?.results;

  const matchProfileToQuery = profiles.find(profile => profile.owner === query)
  

  console.log('Profiles:', profiles)

  console.log('Chat data in inbox:', chatData?.chat?.results)
  // console.log('Current user in inbox:', currentUser?.profile_id)

  const existingChats = (
    <ListGroup>
      {chatData?.chat?.results?.length ? (
      chatData.chat.results.map((chat) => (
          <ListGroup.Item
            key={chat?.id}
            onClick={() => selectChat(chat?.id)}
            className="text-left"
          >
            <Avatar src={chat?.receiver_image} height={40} width={45} />
            <strong className="ml-2">{chat?.receiver_username}</strong>
          </ListGroup.Item>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </ListGroup>
  );

  

  const handleStartNewChat = async () => {
    if (matchProfileToQuery) {
      try {
        const { data } = await axiosReq.post('/chats/', { receiver: matchProfileToQuery.id });
        selectChat(data.id);
        console.log('New chat:', data?.response)
      } catch(err) {
        console.log("Error starting new chat:", err)
      }
    } else {
      console.log("No user found with the id:",query)
    }
  };
  
  return (
    <Container className={`${appStyles.Content} ${styles.SmallComponent}
    ${!mobile && styles.LargeScreen} ${mobile && styles.SmallScreen}
    ${mobile && "d-lg-none"} text-center`} 
    >
      <h4>Inbox</h4>
        {currentUser ? (
          <React.Fragment>
          <Form className={`d-flex ${styles.SearchBar}`}>
          <Form.Control
            type="text"
            placeholder="Find user"
            name="newChat"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
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

export default Inbox

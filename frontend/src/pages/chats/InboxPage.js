import React from 'react';
import { useSelectedChat } from '../../contexts/SelectChatContext';
import { useRedirect } from '../../hooks/useRedirect';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import appStyles from '../../App.module.css';

import Inbox from '../../components/Inbox';
import Messenger from '../../components/Messenger';

const InboxPage = () => {
  // InboxPage component used to render the Inbox and Messenger components
  // on smaller devices and display a message on larger devices
  // informing the user that the Inbox page is only available on smaller devices
  // as they are available on the home page as their own components
  useRedirect('loggedOut');
  const selectedChat = useSelectedChat();
  return (
    <Row className='justify-content-center'>
      <Col xs={12} md={6} className="d-lg-none">
        <Inbox InboxPage />
      </Col>
      <Col xs={12} md={6} className="d-lg-none">
        {selectedChat ? <Messenger InboxPage /> : null}
      </Col>
      <Col lg={6} className={`d-none d-lg-flex text-center ${appStyles.Content}`}>
        <h3>Inbox page is only available on smaller devices</h3>
      </Col>
    </Row>
  )
}

export default InboxPage

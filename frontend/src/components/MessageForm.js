import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSetChatData } from '../contexts/ChatDataContext';
import { useSelectedChat } from '../contexts/SelectChatContext';
import { toast } from 'react-toastify';

import styles from '../styles/Chat.module.css';
import btnStyles from '../styles/Button.module.css';

const MessageForm = ({ typedMessage, setTypedMessage }) => {
  const selectedChat = useSelectedChat();
  const { sendMessage } = useSetChatData();

  const handleChange = (event) => {
    setTypedMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendMessage(selectedChat, typedMessage);
      setTypedMessage('');
      toast.success('Message sent!');
    } catch (err) {
      toast.error('There was an error sending your message. Please try again.');
      console.log('Error sending message:', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={`d-flex`}>
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Type a message..."
        value={typedMessage}
        onChange={handleChange}
        className={styles.MessageInput}
      />
      <Button type="submit" className={`${btnStyles.Button} ${btnStyles.SendButton} ${btnStyles.HexButton}`}><i className="far fa-paper-plane" /></Button>
    </Form>
  );
}

export default MessageForm;
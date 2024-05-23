import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSetChatData } from '../contexts/ChatDataContext';
import { useSelectedChat } from '../contexts/SelectChatContext';
import { toast } from 'react-toastify';

import styles from '../styles/Chat.module.css';
import btnStyles from '../styles/Button.module.css';

const MessageForm = ({ typedMessage, setTypedMessage, fetchCallback }) => {
  const selectedChat = useSelectedChat();
  const { sendMessage } = useSetChatData();

  const handleChange = (event) => {
    const newValue = event.target.value;
    setTypedMessage(newValue);
  };

  useEffect(() => {
  }, [typedMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!typedMessage || !typedMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    try {
      await sendMessage(selectedChat, typedMessage);
      setTypedMessage('');
      fetchCallback(selectedChat)
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
        aria-label="Type your message here"
      />
      <Button
        type="submit"
        className={`${btnStyles.Button}
        ${btnStyles.SendButton} ${btnStyles.HexButton}`}
        aria-label="Send message"
      >
        <i className="far fa-paper-plane" aria-hidden />
        </Button>
    </Form>
  );
}

export default MessageForm;
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSetChatData } from '../contexts/ChatDataContext';
import { useSelectedChat } from '../contexts/SelectChatContext';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import styles from '../styles/Chat.module.css';
import btnStyles from '../styles/Button.module.css';

const MessageForm = ({ typedMessage, setTypedMessage, fetchCallback }) => {
  // MessageForm component used to create and send messages inside selected chat
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
      toast.error('Error sending message');
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
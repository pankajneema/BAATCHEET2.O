// ParentComponent.js

import { useState } from 'react';
import ChatMessagesScreen from './ChatMessagesScreen';

const ParentComponent = () => {
  const [messages, setMessages] = useState([]);

  // WebSocket event handler
  const handleMessageReceived = (messageData) => {
    // Update the messages state
    setMessages(prevMessages => [...prevMessages, messageData]);
  };

  return (
    <ChatMessagesScreen messages={messages} setMessages={setMessages} />
  );
};

export default ParentComponent;

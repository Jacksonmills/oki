type MessageListProps = {
  messages: string[];
};

const MessageList = ({ messages }: MessageListProps) => (
  <ul>
    {messages.map((message, index) => (
      <li key={index}>{message}</li>
    ))}
  </ul>
);

export default MessageList;

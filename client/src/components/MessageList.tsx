import styled from "styled-components";

type MessageListProps = {
  messages: string[];
};

const MessageList = ({ messages }: MessageListProps) => (
  <Wrapper>
    {messages.map((message, index) => (
      <Message key={index}>{message}</Message>
    ))}
  </Wrapper>
);

const Wrapper = styled.ul`
  list-style: none;
  padding: 0;
  width: 100vw;
`;

const Message = styled.li`
  padding: 0 12px;
  max-width: 100vw;
`;

const ConnectedEventMessage = styled(Message)`
  color: green;
  padding: 12px;
  background: #333;
  border-radius: .25rem;
  margin: 6px 12px;
`;

export default MessageList;

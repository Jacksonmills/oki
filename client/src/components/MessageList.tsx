import styled from "styled-components";

export type MessageListProps = {
  messages: {
    content: string,
    isServerMessage: boolean,
    username?: string,
    hexcode?: string,
  }[];
};

const MessageList = ({ messages }: MessageListProps) => (
  <Wrapper>
    {messages.map((message, index) => {
      return message.isServerMessage ? (
        <ConnectedEventMessage key={index}>{message.content}</ConnectedEventMessage>
      ) : (
        <Message key={index}>
          <Username hexcode={message.hexcode}>{message.username}</Username>:{' '}
          {message.content}
        </Message>
      );
    })}
  </Wrapper>
);

const Wrapper = styled.ul`
  list-style: none;
  padding: 0;
  width: 100vw;
`;

const Username = styled.span<{ hexcode?: string; }>`
  color: ${(props) => props.hexcode ? props.hexcode : "#ffffff"};
  font-weight: bold;
  margin-right: 8px;
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

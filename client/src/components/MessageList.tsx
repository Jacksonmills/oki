import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Username from "./Username";
import { MESSAGE_INPUT_HEIGHT } from "./MessageInput";
import { useMessageContext } from "@/MessageContext";
import { COLORS } from "@/constants";
import GradientBorder from "./GradientBorder";

export type MessageListProps = {
  className?: string;
};

const MessageList = ({ className }: MessageListProps) => {
  const { messages } = useMessageContext();
  console.log(messages);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!wrapperRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = wrapperRef.current;
    const atBottom = scrollHeight - scrollTop === clientHeight;

    setShowScrollToBottom(!atBottom);
    setUserScrolled(true);
  };

  const scrollToBottom = () => {
    setUserScrolled(false);
    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTo(0, wrapperRef.current.scrollHeight);
      }
    }, 50);
  };

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setUserScrolled(false);
    scrollToBottom();
  }, [messages]);

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <List>
        {messages.map((message, index) => {
          return (
            <>
              {message.isServerMessage && (
                <ServerEventMessage type={message.type} key={index}>
                  <Username hexcode={message.hexcode}>{message.username}</Username> {message.content}
                </ServerEventMessage>
              )}
              {message.isEXMessage && (
                <EXMessage key={index}>
                  <Username hexcode={message.hexcode}>{message.username}:</Username>
                  {message.content}
                </EXMessage>
              )}
              {!message.isServerMessage && !message.isEXMessage && (
                <Message key={index}>
                  <Username hexcode={message.hexcode}>{message.username}:</Username>
                  {message.content}
                </Message>
              )}
            </>
          );
        })}
      </List>
      {showScrollToBottom && userScrolled && (
        <ScrollToBottomButton onClick={scrollToBottom}>Newer messages</ScrollToBottomButton>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  margin-bottom: ${MESSAGE_INPUT_HEIGHT};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
`;

const Message = styled.li`
  padding: 0 12px;
  max-width: 100vw;
`;

const EXMessage = styled(Message)`
  --border-color: ${COLORS.primary};
  position: relative;
  padding: 12px;
  background: #333;
  border-radius: .15rem;
  margin: 6px 12px;

  ::before {
    --size: -2px;
    content: "";
    position: absolute;
    z-index: -1;
    top: var(--size);
    left: var(--size);
    right: var(--size);
    bottom: var(--size);
    background: linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary});
    border-radius: 0.25rem;
  }
`;

const ServerEventMessage = styled(Message) <{ type?: "connected" | "disconnected", }>`
  --border-color: ${props => props.type === "connected" ? "green" : "red"};
  padding: 12px;
  background: #333;
  border: 2px solid var(--border-color);
  border-radius: .25rem;
  margin: 6px 12px;
`;

const ScrollToBottomButton = styled.button`
  position: absolute;
  top: 82px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px 6px;
`;


export default MessageList;

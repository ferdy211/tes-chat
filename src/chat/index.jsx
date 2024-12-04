import useChat from "./index.hooks";
import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  ChatContainer,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const Chat = () => {
  const { listChat, handleSelectChat, selectedChat, handleSend, message, id } =
    useChat();
  return (
    <MainContainer
      responsive
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Sidebar position="left">
        <ConversationList>
          {listChat &&
            listChat.map((item, key) => (
              <Conversation
                key={key}
                unreadCnt={item.unreadCount}
                onClick={() =>
                  item.chatId !== selectedChat?.chatId && handleSelectChat(item)
                }
                active={selectedChat?.chatId === item.chatId}
                info={item.lastMessage?.text}
                //   lastSenderName={item.chatName}
                name={item.chatName}
              >
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${item.chatName}&size=64&length=1`}
                  // status="available"
                />
              </Conversation>
            ))}
        </ConversationList>
      </Sidebar>
      {selectedChat && (
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              src={`https://ui-avatars.com/api/?name=${selectedChat.chatName}&size=64&length=1`}
              // status="available"
            />
            <ConversationHeader.Content
              //   info="Active 10 mins ago"
              userName={selectedChat.chatName}
            />
          </ConversationHeader>
          <MessageList
            key={selectedChat.chatId}
            // typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            {message.map((e, index) => {
              return (
                <>
                  {e.senderId == id ? (
                    <Message
                      style={{ paddingTop: index == 0 ? 12 : 0 }}
                      key={index}
                      avatarSpacer
                      model={{
                        direction: "outgoing",
                        message: e.text,
                        position: "single",
                        sender: e.senderName,
                        sentTime: "15 mins ago",
                      }}
                    />
                  ) : (
                    <Message
                      style={{ paddingTop: index == 0 ? 12 : 0 }}
                      key={index}
                      model={{
                        direction: "incoming",
                        message: e.text,
                        position: "single",
                        sender: e.senderName,
                        sentTime: "15 mins ago",
                      }}
                    >
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${selectedChat.senderName}&size=64&length=1`}
                      />
                    </Message>
                  )}
                </>
              );
            })}
          </MessageList>
          <MessageInput onSend={handleSend} placeholder="Type message here" />
        </ChatContainer>
      )}
    </MainContainer>
  );
};

export default Chat;

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
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const Chat = () => {
  const {
    listChat,
    handleSelectChat,
    selectedChat,
    handleSend,
    message,
    id,
    deleteMessage,
  } = useChat();
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
                lastSenderName={
                  id == item.lastMessage?.senderId
                    ? "You"
                    : item.lastMessage?.senderName
                }
                name={item.chatName}
              >
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${item.chatName}&size=64&length=2`}
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
              src={`https://ui-avatars.com/api/?name=${selectedChat.chatName}&size=64&length=2`}
              // status="available"
            />
            <ConversationHeader.Content
              //   info="Active 10 mins ago"
              userName={
                selectedChat.chatName +
                ` (${selectedChat.participants.map((e) => {
                  if (e.userId == id) {
                    return "You";
                  } else {
                    return e.userName;
                  }
                })})`
              }
            />
          </ConversationHeader>
          <MessageList
            key={selectedChat.chatId}
            // typingIndicator={
            //   <>
            //     <TypingIndicator
            //       content={
            //         <>
            //           <p>Zoel is typing</p>
            //         </>
            //       }
            //     />
            //   </>
            // }
          >
            {message.map((e, index) => {
              return (
                <>
                  {e.senderId == id ? (
                    <Message
                      onDoubleClick={() => {
                        deleteMessage(e.id);
                      }}
                      style={{
                        paddingTop: index == 0 ? 12 : 0,
                        cursor: "pointer",
                      }}
                      key={index}
                      avatarSpacer
                      model={{
                        direction: "outgoing",
                        message: e.text,
                        position: "single",
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
                      }}
                    >
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${
                          selectedChat.participants.find(
                            (i) => i.userId == e.senderId
                          )?.userName
                        }&size=64&length=2`}
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

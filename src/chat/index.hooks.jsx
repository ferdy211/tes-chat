import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://47.129.249.209:3001";
// const baseUrl = "http://localhost:3001";

const useChat = () => {
  const { id } = useParams();
  const socket = io
    .connect(baseUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })
    .on("connect", () => {
      socket.emit("joinChat", id);
      console.log("connected", id);
    });
  const [listChat, setListChat] = useState([]);
  const getListChat = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/chats/${id}`);
      if (response.data && response.data.length > 0) {
        setListChat(response.data);
      } else {
        setListChat([]);
      }
    } catch (error) {
      console.log(error);
      setListChat([]);
    }
  };
  const [message, setMessage] = useState([]);
  const getMessage = async (chatId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/chats/${chatId}/messages`,
        {
          params: { page: 0, limit: 20 },
        }
      );
      if (response?.data?.messages && response.data.messages.length > 0) {
        setMessage(response.data.messages);
      } else {
        console.log("empty");
        setMessage([]);
      }
    } catch (error) {
      console.log(error);
      setMessage([]);
    }
  };
  useEffect(() => {
    getListChat(id);
  }, [id]);
  useEffect(() => {
    socket.on("roomChat", (chat) => {
      const findChat = chat.find((item) => item.userId == id);
      const newListChat = listChat.filter(
        (item) => item.chatId != findChat?.groupChat?.chatId
      );
      setListChat([findChat.groupChat, ...newListChat]);
    });
    socket.on("readRoomChat", (newMessage) => {
      const newListChat = listChat.map((item) => {
        if (item.chatId === newMessage.chatId) {
          return newMessage;
        }
        return item;
      });
      setListChat(newListChat);
    });
    socket.on("message", (newMessage) => {
      if (selectedChat && newMessage.chatId === selectedChat.chatId) {
        setMessage([newMessage, ...message]);
      }
    });
  }, [socket]);
  const [selectedChat, setSelectedChat] = useState(null);
  const handleSelectChat = (e) => {
    setSelectedChat(e);
    getMessage(e?.chatId);
    socket.emit("readMessage", {
      userId: id,
      chatId: e?.chatId,
    });
  };
  const handleSend = (e) => {
    socket.emit("newMessage", {
      chatId: selectedChat.chatId,
      senderId: id,
      text: e,
      participantIds: selectedChat.participants,
      senderName: id == 0 ? "Admin" : "User",
    });
  };
  return {
    socket,
    listChat,
    handleSelectChat,
    selectedChat,
    handleSend,
    message,
    id,
  };
};

export default useChat;

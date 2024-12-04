import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useState, useEffect, useMemo, useReducer } from "react";
import axios from "axios";
import { reducer, initialState } from "./reducer";

const baseUrl = "http://47.129.249.209:3001";
// const baseUrl = "http://localhost:3001";

const useChat = () => {
  console.log("re render");
  const { id } = useParams();
  const socket = useMemo(() => {
    return io
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
  }, [id]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const getListChat = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/chats/${id}`);
      if (response.data && response.data.length > 0) {
        dispatch({ type: "SET_LIST_CHAT", payload: response.data });
      } else {
        dispatch({ type: "SET_LIST_CHAT", payload: [] });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_LIST_CHAT", payload: [] });
    }
  };
  useEffect(() => {
    getListChat(id);
  }, [id]);
  const getMessage = async (chatId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/chats/${chatId}/messages`,
        {
          params: { page: 0, limit: 20 },
        }
      );
      if (response?.data?.messages && response.data.messages.length > 0) {
        dispatch({ type: "SET_MESSAGE", payload: response.data.messages });
      } else {
        dispatch({ type: "SET_MESSAGE", payload: [] });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_MESSAGE", payload: [] });
    }
  };
  useEffect(() => {
    socket.on("roomChat", (chat) => {
      dispatch({
        type: "NEW_CHAT",
        payload: { data: chat, id },
      });
    });
    socket.on("readRoomChat", (newMessage) => {
      dispatch({ type: "READ_MESSAGE", payload: newMessage });
    });
    socket.on("message", (newMessage) => {
      dispatch({
        type: "NEW_CHAT_MESSAGE",
        payload: newMessage,
      });
    });
  }, [socket]);
  const handleSelectChat = (e) => {
    dispatch({ type: "SET_SELECTED_CHAT", payload: e });
    getMessage(e?.chatId);
    socket.emit("readMessage", {
      userId: id,
      chatId: e?.chatId,
    });
  };
  const handleSend = (e) => {
    socket.emit("newMessage", {
      chatId: state.selectedChat.chatId,
      senderId: id,
      text: e,
      participantIds: state.selectedChat.participants,
      senderName: id == 0 ? "Admin" : "User",
    });
  };
  return {
    socket,
    listChat: state.listChat,
    handleSelectChat,
    selectedChat: state.selectedChat,
    handleSend,
    message: state.message,
    id,
  };
};

export default useChat;

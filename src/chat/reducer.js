export const initialState = {
  listChat: [],
  message: [],
  selectedChat: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_CHAT":
      return { ...state, selectedChat: action.payload };
    case "SET_LIST_CHAT":
      return { ...state, listChat: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload.reverse() };
    case "READ_MESSAGE":
      return {
        ...state,
        listChat: state.listChat.map((item) => {
          if (item.chatId === action.payload.chatId) {
            return action.payload;
          }
          return item;
        }),
      };
    case "NEW_CHAT":
      const findChat = action.payload.data.find(
        (item) => item.userId == action.payload.id
      );
      const newListChat = state.listChat.filter(
        (item) => item.chatId != findChat?.groupChat?.chatId
      );
      return { ...state, listChat: [findChat.groupChat, ...newListChat] };
    case "NEW_CHAT_MESSAGE":
      const isSameRoom =
        !!state.selectedChat &&
        action.payload.chatId == state.selectedChat.chatId;
      if (isSameRoom) {
        return {
          ...state,
          message: [
            ...state.message.filter((item) => item.id != action.payload.id),
            action.payload,
          ],
        };
      }
      return { ...state };
    default:
      return state;
  }
};

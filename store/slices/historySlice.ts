import { createSlice } from "@reduxjs/toolkit";

// Add Message type
interface Message {
  id: number;
  sender: string;
  message: string;
}

interface ChatState {
  [chatId: string]: Message[];
}

const initialState: ChatState = {};

export const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    addChatHistoryEntry: (
      state,
      action: { payload: { chatId: string; message: Message } }
    ) => {
      const { chatId, message } = action.payload;
      if (!state[chatId]) {
        state[chatId] = [];
      }
      state[chatId].push(message);
    },
    clearChatHistory: (state, action: { payload: string }) => {
      const chatId = action.payload;
      state[chatId] = [];
    },
    updateChatHistoryEntry: (
      state,
      action: { payload: { chatId: string; id: number; message: string } }
    ) => {
      const { chatId, id, message } = action.payload;
      const entry = state[chatId]?.find((item) => item.id === id);
      if (entry) {
        entry.message = message;
      }
    },
  },
});

export const { addChatHistoryEntry, clearChatHistory, updateChatHistoryEntry } =
  chatHistorySlice.actions;

export default chatHistorySlice.reducer;

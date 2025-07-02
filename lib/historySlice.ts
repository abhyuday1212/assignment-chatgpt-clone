import { createSlice } from "@reduxjs/toolkit"

// Add Message type
interface Message {
  id: number;
  sender: string;
  message: string;
}

const initialState: { value: Message[] } = {
  value: [],
}

export const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    addChatHistoryEntry: (state, action: { payload: Message }) => {
      state.value.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.value = [];
    },
    updateChatHistoryEntry: (state, action: { payload: { id: number; message: string } }) => {
      const { id, message } = action.payload;
      const entry = state.value.find((item) => item.id === id);
      if (entry) {
        entry.message = message;
      }
    },
  },
});

export const { addChatHistoryEntry, clearChatHistory, updateChatHistoryEntry } = chatHistorySlice.actions

export default chatHistorySlice.reducer

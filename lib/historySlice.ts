import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  value: [],
}

export const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    addChatHistoryEntry: (state, action) => {
      state.value.push(action.payload)
    },
    clearChatHistory: () => initialState,
    updateChatHistoryEntry: (state, action) => {
      const { id, message } = action.payload
      const entry = state.value.find((item) => item.id === id)
      if (entry) {
        entry.message = message
      }
    },
  },
})

export const { addChatHistoryEntry, clearChatHistory, updateChatHistoryEntry } = chatHistorySlice.actions

export default chatHistorySlice.reducer

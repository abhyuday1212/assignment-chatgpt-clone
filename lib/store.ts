import { configureStore } from "@reduxjs/toolkit"
import chatHistoryReducer from "./historySlice"

export const store = configureStore({
  reducer: {
    chatHistory: chatHistoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { configureStore } from "@reduxjs/toolkit";
import chatHistoryReducer from "./historySlice";
import fileUploadReducer from "./fileUploadSlice";

export const store = configureStore({
  reducer: {
    chatHistory: chatHistoryReducer,
    fileUpload: fileUploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

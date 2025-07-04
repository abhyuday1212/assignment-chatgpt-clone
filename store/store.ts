import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import chatHistoryReducer from "./slices/historySlice";
import fileUploadReducer from "./slices/fileUploadSlice";

// Did this to handle error:
// redux-persist failed to create sync storage. falling back to noop storage.
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const secretKey = "assignment-galaxyAi-secret-key";

const persistConfig = {
  key: "galaxy-ai", // key in storage
  storage,
  whitelist: ["chatHistory"],
  blacklist: [],
  transforms: [
    encryptTransform({
      secretKey,
      onError: function (error) {
        console.error("Encryption error:", error);
      },
    }),
  ],
};

const rootReducer = combineReducers({
  chatHistory: chatHistoryReducer,
  fileUpload: fileUploadReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { persistor, store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

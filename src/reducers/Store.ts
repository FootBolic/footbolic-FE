import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import RootReducer from "./RootReducer";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['menuReducer']
};

const reducer = persistReducer(persistConfig, RootReducer);

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})

export default store;
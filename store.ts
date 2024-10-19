import { configureStore } from "@reduxjs/toolkit";
import serversReducer from "@/slices/serversSlice";
import templatesReducer from "@/slices/templatesSlice";

export const store = configureStore({
  reducer: {
    servers: serversReducer,
    templates: templatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

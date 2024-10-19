import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Server } from "@/types/server";
import type { RootState } from "@/store";

const noServer: Server[] = [];

const storageKey = "servers";

export const readServers = createAsyncThunk<Server[]>(
  "servers/read",
  async (_): Promise<Server[]> => {
    // Get saved servers
    const serversSavedStr = localStorage.getItem(storageKey);
    if (!serversSavedStr) {
      // No server
      return noServer;
    }
    try {
      return JSON.parse(serversSavedStr);
    } catch (e) {
      // Broken string
      localStorage.removeItem(storageKey);
      return noServer;
    }
  },
);

export const saveServers = createAsyncThunk(
  "servers/save",
  async (_, { getState }) => {
    const state: any = getState() as RootState;
    localStorage.setItem(storageKey, JSON.stringify(state.servers));
  },
);

export const serversSlice = createSlice({
  name: "servers",
  initialState: noServer,
  reducers: {
    addServer: (state, action: PayloadAction<Server>) => {
      state.push(action.payload);
    },
    updateServerByIndex: (
      state,
      action: PayloadAction<{
        index: number;
        server: Server;
      }>,
    ) => {
      state.splice(action.payload.index, 1, action.payload.server);
    },
    removeServerByIndex: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      readServers.fulfilled,
      (_, action: PayloadAction<Server[]>) => action.payload,
    );
    builder.addCase(saveServers.fulfilled, () => {});
  },
});

export const { addServer, updateServerByIndex, removeServerByIndex } =
  serversSlice.actions;

export default serversSlice.reducer;

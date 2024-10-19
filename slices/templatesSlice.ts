import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Template } from "@/types/template";
import type { RootState } from "@/store";

const noTemplate: Template[] = [];

const storageKey = "templates";

export const readTemplates = createAsyncThunk<Template[]>(
  "templates/read",
  async (_): Promise<Template[]> => {
    // Get saved templates
    const templatesSavedStr = localStorage.getItem(storageKey);
    if (!templatesSavedStr) {
      // No template
      return noTemplate;
    }
    try {
      return JSON.parse(templatesSavedStr);
    } catch (e) {
      // Broken string
      localStorage.removeItem(storageKey);
      return noTemplate;
    }
  },
);

export const saveTemplates = createAsyncThunk(
  "templates/save",
  async (_, { getState }) => {
    const state: any = getState() as RootState;
    localStorage.setItem(storageKey, JSON.stringify(state.templates));
  },
);

export const templatesSlice = createSlice({
  name: "templates",
  initialState: noTemplate,
  reducers: {
    addTemplate: (state, action: PayloadAction<Template>) => {
      state.push(action.payload);
    },
    removeTemplateByIndex: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      readTemplates.fulfilled,
      (_, action: PayloadAction<Template[]>) => action.payload,
    );
    builder.addCase(saveTemplates.fulfilled, () => {});
  },
});

export const { addTemplate, removeTemplateByIndex } = templatesSlice.actions;

export default templatesSlice.reducer;

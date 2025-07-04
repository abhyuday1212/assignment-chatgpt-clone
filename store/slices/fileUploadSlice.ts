import { createSlice } from "@reduxjs/toolkit";

interface FileUploadState {
  extractedText: string | null;
}

const initialState: FileUploadState = {
  extractedText: null,
};

export const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    setExtractedText: (state, action: { payload: string }) => {
      state.extractedText = action.payload;
    },
    clearExtractedText: (state) => {
      state.extractedText = null;
    },
  },
});

export const { setExtractedText, clearExtractedText } = fileUploadSlice.actions;

export default fileUploadSlice.reducer;

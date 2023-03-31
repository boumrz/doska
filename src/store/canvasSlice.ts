import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

interface CanvasState {
  lines: { x: number; y: number }[];
  color: string;
}

const initialState: CanvasState = {
  lines: [],
  color: "black"
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addLine: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.lines.push(action.payload);
    },
    clearCanvas: state => {
      state.lines = [];
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    }
  }
});

export const { addLine, clearCanvas, setColor } = canvasSlice.actions;

export default canvasSlice.reducer;

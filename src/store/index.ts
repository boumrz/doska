import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "./canvasSlice";

export default configureStore({
  reducer: {
    canvas: canvasReducer,
  },
});

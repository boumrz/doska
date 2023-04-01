import { useRef } from "react";
import { io } from "socket.io-client";
import { useCanvas } from "@/hooks";

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
  color: string;
}

const socket = io("http://localhost:5002");

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { onMouseDown, onMouseMove, onMouseUp } = useCanvas({
    socket,
    canvasRef,
  });

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};

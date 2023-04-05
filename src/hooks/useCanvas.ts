import {
  MouseEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Socket } from "socket.io-client";

interface UseCanvasProps {
  socket: Socket;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
  color?: string;
}

export const useCanvas = ({ socket, canvasRef }: UseCanvasProps) => {
  const [lastPoint, setLastPoint] = useState(<Point | null>null);
  const [lastPointStart, setLastPointStart] = useState(<Point | null>null);

  const handleDraw = ({ start, end, color }: Line) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "black";

    //TODO: сделать typeguard
    if (start && end && typeof start === "object" && typeof end === "object") {
      context.strokeStyle = color || "black";
      context.lineCap = "round";
      context.lineJoin = "round";

      context.beginPath();
      console.log("start.x, start.y", start.x, start.y);
      console.log("end.x, end.y", end.x, end.y);
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    } else {
      console.error("Неверный формат данных для рисования:", start, end);
    }
  };

  useEffect(() => {
    socket.on("draw", handleDraw);
  }, []);

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const start = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    setLastPointStart(start);
    socket.emit("mousedown", start);
  };

  const onMouseUp: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const end = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    setLastPoint(end);
    socket.emit("mouseup", end);
  };

  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const end = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    setLastPoint(end);

    socket.emit("mousemove", end);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};

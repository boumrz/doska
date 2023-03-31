import { MouseEventHandler, MutableRefObject, useEffect, useRef } from "react";
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
  color: string;
}

export const useCanvas = ({ socket, canvasRef }: UseCanvasProps) => {
  const lines = useSelector(
    (state: { canvas: { lines: Line[] } }) => state.canvas.lines
  );
  const dispatch = useDispatch();
  let lastPoint: Point | null = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "black";

    // Получаем сохраненное состояние холста из локального хранилища
    const savedCanvas = localStorage.getItem("canvas");
    if (savedCanvas) {
      const lines = JSON.parse(savedCanvas);
      dispatch({ type: "SET_LINES", payload: lines });
      lines.forEach(({ start, end, color }: Line) => {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
      });
    }

    // Отправляем запрос на получение текущего состояния холста
    socket.emit("requestCanvas");

    // Восстанавливаем состояние холста
    socket.on("canvas", (canvasLines) => {
      dispatch({ type: "SET_LINES", payload: canvasLines });
      canvasLines.forEach(({ start, end, color }: Line) => {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
      });
      // Сохраняем текущее состояние холста в локальном хранилище
      localStorage.setItem("canvas", JSON.stringify(canvasLines));
    });

    socket.on("draw", ({ start, end, color }: Line) => {
      //TODO: сделать typeguard
      if (
        start &&
        end &&
        typeof start === "object" &&
        typeof end === "object"
      ) {
        context.strokeStyle = color;
        console.log("lastPoint", lastPoint);
        context.lineCap = "round";
        context.lineJoin = "round";
        if (lastPoint) {
          context.moveTo(lastPoint.x, lastPoint.y);
          context.beginPath();
          context.lineTo(lastPoint.x, lastPoint.y);
          context.stroke();
        } else {
          context.moveTo(start.x, start.y);
          context.beginPath();
          context.lineTo(end.x, end.y);
          context.stroke();
        }
        lastPoint = end;
        // Сохраняем текущее состояние холста в локальном хранилище и Redux
        const currentLines = [...lines, { start, end, color }];
        dispatch({ type: "SET_LINES", payload: currentLines });
        localStorage.setItem("canvas", JSON.stringify(currentLines));
      } else {
        console.error("Неверный формат данных для рисования:", start, end);
      }
    });

    // Очищаем холст
    socket.on("clear", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Удаляем сохраненное состояние холста из локального хранилища и Redux
      dispatch({ type: "CLEAR_LINES" });
      localStorage.removeItem("canvas");
    });
  }, [lastPoint, socket]);

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const start = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    socket.emit("mousedown", start);
  };

  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!event.buttons) {
      return;
    }

    const end = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    socket.emit("mousemove", end);
  };

  return {
    onMouseDown,
    onMouseMove,
  };
};

const express = require("express");

const PORT = 5002;
const HOST = "192.168.1.5";

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let canvasLines = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  // Генерируем уникальное имя пользователя
  const username = `user${Math.floor(Math.random() * 1000)}`;
  socket.username = username;

  // Инициализируем параметр isDraw для пользователя
  socket.isDraw = false;

  socket.emit("canvas", canvasLines);

  socket.on("mousedown", (start) => {
    socket.isDraw = true;
    socket.emit("mousedown", start);
  });

  socket.on("mouseup", (start) => {
    socket.isDraw = false;
    socket.emit("mousedown", start);
  });

  socket.on("mousemove", (end) => {
    const lastPoint = socket.lastPoint || end;
    const color = socket.color || "black";
    socket.lastPoint = end;
    if (socket.isDraw) {
      io.emit("draw", {
        start: lastPoint,
        end,
        color,
        username: socket.username,
      });
      canvasLines.push({ start: lastPoint, end, color, username });
    }
  });

  socket.on("setColor", (color) => {
    socket.color = color;
  });

  socket.on("clear", () => {
    canvasLines = [];
    io.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
  });
});

http.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

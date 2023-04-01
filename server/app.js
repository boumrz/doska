const express = require("express");
// const os = require('os');

// const wifiInterface = os.networkInterfaces().wlan0;
// const wifiIP = wifiInterface.find((iface) => iface.family === 'IPv4').address;

const PORT = 5002;
const HOST = "192.168.1.2";

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Инициализируем текущее состояние холста
let canvasLines = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  // Отправляем текущее состояние холста новому пользователю
  socket.emit("canvas", canvasLines);

  socket.on("mousedown", (start) => {
    socket.emit("mousedown", start);
  });

  socket.on("mousemove", (end) => {
    const lastPoint = socket.lastPoint || end;
    const color = socket.color || "black";

    socket.lastPoint = end;
    socket.emit("draw", { start: lastPoint, end: end, color: color });
    // Добавляем текущее состояние холста на сервер
    canvasLines.push({ start: lastPoint, end, color });
  });

  socket.on("setColor", (color) => {
    socket.color = color;
  });

  socket.on("clear", () => {
    canvasLines = [];
    socket.broadcast.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

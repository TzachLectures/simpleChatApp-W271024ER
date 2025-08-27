import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const chatMessages = [];
const userNamesMap = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.emit("message recived", chatMessages);

  socket.on("message sent", (data) => {
    console.log(data);
    chatMessages.push(data);
    io.emit("message recived", chatMessages);
  });

  socket.on("userName changed", (data) => {
    console.log(data);
    userNamesMap[socket.id] = data;
    io.emit("userName change recived", userNamesMap);
  });
});

app.get("/", (req, res) => res.send("Hello from server"));

server.listen(8181, () => console.log("Server is listening to port 8181"));

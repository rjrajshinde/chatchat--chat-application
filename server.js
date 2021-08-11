const express = require("express");
const http = require("http");
const { format } = require("path");
const path = require("path"); //use to work with paths
const socketio = require("socket.io");
const app = express();
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUser,
} = require("./utils/users");

var port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketio(server);

const botName = "ChatChat Bot";

//run when the client connects
//from here we are emiting or broadcasting the message and the main.js will catch it to the client
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //this emits the message to single user
    socket.emit("message", formatMessage(botName, "Welcome to ChatChat😈"));

    //broadcast the message when the user connects to chat
    //this message emits to everybody except the user who emits it or user that's connecting
    //we don't need to notify the user that he is connecting we notify others that this user is connecting to chat
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined a Chat`)
      );

    //send the users and room info on the sidebar of chat.html
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUser(user.room),
    });
  });

  //catching the message that throw from client/user     //listen for [chatMessage]
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    // console.log(msg); //prints on the server side console
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      //this emits the message to everyone on the chat
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      //send the users and room info on the sidebar of chat.html
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUser(user.room),
      });
    }
  });
});

//setting the static folder
app.use(express.static(path.join(__dirname, "public")));

//server running
server.listen(port, () =>
  console.log(`Go to PORT ${port}, Server Running......`)
);

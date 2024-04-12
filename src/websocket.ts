import { io } from "./http";

interface IRoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface IMessage {
  room: string;
  username: string;
  message: string;
  createdAt: Date;
}

const users: IRoomUser[] = [];

const messages: IMessage[] = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id,
      });
    }
  });

  socket.on("message", (data) => {
    const message: IMessage = {
      room: data.room,
      username: data.username,
      message: data.message,
      createdAt: new Date(),
    };

    messages.push(message);

    io.to(data.room).emit("message", message);
  });
});

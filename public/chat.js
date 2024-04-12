const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

socket.emit("select_room", { username, room });

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const message = event.target.value;

      const data = {
        username,
        room,
        message,
      };

      socket.emit("message", data);
      event.target.value = "";
    }
  });

socket.on("message", (data) => {
  console.log(data);
});

const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

const usernameDiv = document.getElementById("username");

usernameDiv.innerHTML += `
  <div style="display: flex; justify-content: space-between">
    <div id="username">Bem-vindo <strong>${username}</strong></div>
    <div>Você está na sala: <strong>${room}</strong></div>
  </div>
`;

socket.emit(
  "select_room",
  {
    username,
    room,
  },
  (messages) => {
    messages.forEach((message) => {
      createMessage(message);
    });
  }
);

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
  createMessage(data);
});

function createMessage(data) {
  const messageDiv = document.getElementById("messages");

  messageDiv.innerHTML += `
    <div class="new_message">
      <label for="form-label" class="form-label">
        <span>${data.username}:</span> <span class="badge text-bg-secondary">${
    data.message
  }</span>
        <span style="font-size: 12px">${dayjs(data.createdAt).format(
          "DD/MM HH:MM"
        )}</span>
      </label>
    </div>
  `;
}

document.getElementById("logout").addEventListener("click", (event) => {
  window.location.href = "index.html";
});

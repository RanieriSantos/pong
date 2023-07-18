<script lang="ts">
  import { onMount } from "svelte";
  import { socket } from "../stores/socket";
  import type { Socket } from "socket.io-client";

  let io: Socket;
  let message = "";

  onMount(() => {
    socket.subscribe((socket) => {
      io = socket;
      io.connect();
    });

    io.on("roomChat", (data) => {
      const chatMessages = document.getElementById("chat-messages");
      const messageDiv = document.createElement("div");
      const messageSender = document.createElement("span");
      const messageText = document.createElement("span");
      if (data.id === io.id) {
        messageSender.textContent = "Me";
        messageSender.style.color = "red";
      } else {
        messageSender.textContent = data.id;
        messageSender.style.color = "gray";
      }
      messageSender.style.fontWeight = "bold";
      messageSender.style.marginRight = "0.5rem";

      messageText.textContent = data.message;
      messageDiv.appendChild(messageSender);
      messageDiv.appendChild(messageText);
      if (chatMessages) {
        chatMessages.appendChild(messageDiv);
      }
    });
  });

  function sendMessage() {
    const data = {
      id: io.id,
      message: message,
    };
    io.emit("globalChat", data);
    message = "";
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  window.addEventListener("updateId", () => {
    localStorage.getItem("gameId");
  });
</script>

<div id="room-chat">
  <div>
    <h1>Room id: {localStorage.getItem("gameId")}</h1>
  </div>
  <div id="room-chat-header">
    <h1>Room Chat</h1>
  </div>
  <div id="chat-box">
    <div id="chat-messages" />
    <div id="chat-input">
      <input
        type="text"
        placeholder="Type a message"
        bind:value={message}
        on:keydown={handleEnter}
      />
      <button on:click={sendMessage}>Send</button>
    </div>
  </div>
</div>

<style>
  #room-chat {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    width: 15%;
    padding: 10px;
  }

  #chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  #chat-messages {
    flex: 1;
    overflow-y: scroll;
  }

  #chat-input {
    display: flex;
    flex-direction: row;
  }

  #chat-input input {
    flex: 1;
  }

  #chat-input button {
    margin-left: 5px;
  }

  #room-chat-header {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  #room-chat-header h1 {
    margin: 0;
  }
</style>

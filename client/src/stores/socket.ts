import { io } from "socket.io-client";
import { writable } from "svelte/store";

export const socket = writable(
  io("http://localhost:3000", {
    autoConnect: false,
  })
);

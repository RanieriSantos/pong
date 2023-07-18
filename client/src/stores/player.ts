import { writable } from "svelte/store";

export const playerStore = writable({
  positionY: 0,
  points: 0,
  side: "",
  name: "",
  ready: false,
  roomId: "",
});

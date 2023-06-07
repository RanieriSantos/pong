import { writable } from "svelte/store";

export const opponentStore = writable({
  positionY: 0,
  points: 0,
  side: "",
  name: "",
  ready: false,
});

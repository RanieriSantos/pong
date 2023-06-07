import { writable } from "svelte/store";

export const ballStore = writable({
  posX: 0,
  posY: 0,
  speedX: 0.2,
  speedY: 0.2,
  radius: 25,
});

import { writable } from "svelte/store";

export const arenaStore = writable({
  height: 768,
  width: 1024,
});

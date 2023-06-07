<script lang="ts">
  import { ballStore } from "../stores/ball";

  export let posX: number;
  export let posY: number;

  ballStore.subscribe((ballStore) => {
    posX = ballStore.x;
    posY = ballStore.y;
  });
</script>

<div id="ball" style:transform={`translate(${posX}px, ${posY}px)`} />

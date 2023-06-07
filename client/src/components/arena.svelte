<script lang="ts">
  import { arenaStore } from "../stores/arena";
  let height: number;
  let width: number;
  arenaStore.subscribe((arenaStore) => {
    height = arenaStore.height;
    width = arenaStore.width;
  });
</script>

<div id="game" style:height="{height}px" style:width="{width}px">
  <div class="vline" />
</div>

<script lang="ts">
  export let posY = 0;
  export let side: string;
  export let height;
</script>

<div
  class="pad {side}"
  style="transform: translateY({posY}px);"
  bind:clientHeight={height}
/>

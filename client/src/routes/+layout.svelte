<script lang="ts">
  import "../../src/styles/style.css";
  import GlobalChat from "../components/globalChat.svelte";
</script>

<div class="app">
  <main>
    <slot />
    <GlobalChat />
  </main>
</div>

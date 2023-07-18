<script>
  import GlobalChat from "../../components/globalChat.svelte";

  import RoomChat from "../../components/roomChat.svelte";
</script>

<div class="app">
  <main>
    <RoomChat />
    <slot />
    <GlobalChat />
  </main>
</div>

<script lang="ts">
  import { socket } from "../../stores/socket";
  let roomId: string = "";

  socket.subscribe((socket) => {
    socket.on("notFound", (data) => {
      alert(data.message);
    });

    socket.on("join", (data) => {
      
      window.location.href = `/match`;
    });
  });

  const join = () => {
    if (roomId === "") {
      alert("Please enter a room id");
      return;
    }
    socket.subscribe((socket) => {
      let data = {
        roomId: roomId,
      };
      socket.emit("join", data);
    });
  };
</script>

<section>
  <div>
    <form on:submit|preventDefault={join}>
      <label>
        Room id:
        <input type="text" bind:value={roomId} />
      </label>
      <button type="submit">Join</button>
    </form>
  </div>
</section>

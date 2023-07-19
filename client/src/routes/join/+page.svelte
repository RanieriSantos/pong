<script lang="ts">
  import { socket } from "../../stores/socket";
  let roomId: string = "";
  let name: string = "";

  socket.subscribe((socket) => {
    socket.on("notFound", (data) => {
      alert(data.message);
    });

    socket.on("roomFound", (data) => {
      localStorage.setItem("roomId", data.roomId);
      window.location.href = `/match`;
    });
  });

  const join = () => {
    if (roomId === "" || name === "") {
      alert("Please enter a room id and a name");
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
      You will be assigned the remaining side
      <label>
        Name:
        <input type="text" bind:value={name} />
      </label>
      <label>
        Room id:
        <input type="text" bind:value={roomId} />
      </label>
      <button type="submit">Join</button>
    </form>
  </div>
</section>

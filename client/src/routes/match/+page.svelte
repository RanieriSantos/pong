<script lang="ts">
  import type { Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import Ball from "../../components/ball.svelte";
  import Paddle from "../../components/paddle.svelte";
  import PlayerStatus from "../../components/player_status.svelte";
  import { arenaStore } from "../../stores/arena";
  import { ballStore } from "../../stores/ball";
  import { socket } from "../../stores/socket";
  import { playerStore } from "../../stores/player";
  import { opponentStore } from "../../stores/opponent";
  import Swal from "sweetalert2";

  enum Side {
    Left = "left",
    Right = "right",
  }

  let leftPaddlePosY = 0;
  let rightPaddlePosY = 0;
  let io: Socket;
  let isPlayerReady = false;

  onMount(() => {
    socket.subscribe((socket) => {
      io = socket;
      io.connect();
    });

    io.on("mouseMove", (data: { side: string; y: number }) => {
      if (data.side === Side.Left) {
        leftPaddlePosY = data.y - 100;
      } else {
        rightPaddlePosY = data.y - 100;
      }
    });

    io.on("gameOver", (data: { winner: string }) => {
      Swal.fire({
        position: "top-end",
        title: `Game over! ${data.winner} won!`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    });

    io.on("increaseScore", (data: { side: string }) => {
      if (data.side === $playerStore.side) {
        $playerStore.points++;
      }
      if (data.side === $opponentStore.side) {
        $opponentStore.points++;
      }
    });

    io.on("ballPosition", (data: { x: number; y: number; radius: number }) => {
      $ballStore.posX = data.x - data.radius;
      $ballStore.posY = data.y - data.radius;
    });

    io.on("join", (data: { playerName: string; side: string }) => {
      isPlayerReady = true;
    });

    io.on("sideNotAvailable", () => {
      Swal.fire({
        position: "top-end",
        title: "Unfortunately the side is not available",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    });
  });

  function handleMousemove(e: MouseEvent) {
    io.emit("mouseMove", { side: $playerStore.side, y: e.clientY });
  }

  function collectPlayerData() {
    if (!$playerStore.name || !$playerStore.side) {
      Swal.fire({
        title: "Please insert your name and pick a side",
        icon: "warning",
      });
      return;
    }
    io.emit("createRoom", { name: $playerStore.name, side: $playerStore.side });
  }
</script>

<div id="matchDiv">
  {#if !isPlayerReady}
    <div id="sideSelection">
      <form on:submit|preventDefault={collectPlayerData}>
        <label>
          Name:
          <input type="text" bind:value={$playerStore.name} />
        </label>
        <label>
          Side:
          <select bind:value={$playerStore.side}>
            {#each [Side.Left, Side.Right] as side}
              <option value={side}>{side}</option>
            {/each}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  {:else}
    <div
      id="game"
      style:height="{$arenaStore.height}px"
      style:width="{$arenaStore.width}px"
      on:mousemove={handleMousemove}
    >
      <div class="vline" />
      <Ball posX={$ballStore.posX} posY={$ballStore.posY} />
      <Paddle on:mousemove side={Side.Left} posY={leftPaddlePosY} height={0} />
      <Paddle
        on:mousemove
        side={Side.Right}
        posY={rightPaddlePosY}
        height={0}
      />
    </div>
  {/if}
</div>

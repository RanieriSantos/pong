<script>
  export let player_side = "";
  export let player_name = "";
  export let player_points = 0;
</script>

<div class={player_side}>
  <div>{player_name}</div>
  <div>Points: {player_points}</div>
</div>

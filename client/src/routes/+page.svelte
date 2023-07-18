<script>
  import GlobalChat from "../components/globalChat.svelte";
</script>

<div id="gameMenuContainer">
  <div id="gameMenu">
    <h1>PGON</h1>
    <h4>Pong Game Over Network</h4>

    <div>
      <button>
        <a href="/match">Create lobby</a>
      </button>
      <button>
        <a href="/join">Join lobby</a>
      </button>
    </div>
  </div>
  <GlobalChat />
</div>

<style>
  #gameMenuContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  #gameMenu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #1a1a1a;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 0 1rem black;
  }

  #gameMenu h1 {
    font-weight: 500;
    font-size: 3rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  #gameMenu h4 {
    font-family: "Quicksand", sans-serif;
    font-weight: 300;
    font-size: 1rem;
    color: #fff;
    margin-bottom: 2rem;
  }

  #gameMenu button {
    background-color: #fff;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    box-shadow: 0 0 0.5rem black;
  }

  #gameMenu button a {
    text-decoration: none;
    color: #000;
    font-family: "Quicksand", sans-serif;
    font-weight: 500;
    font-size: 1rem;
  }

  #gameMenu button:hover {
    cursor: pointer;
    background-color: #f2f2f2;
  }

  #gameMenu button:active {
    background-color: #e6e6e6;
  }
</style>

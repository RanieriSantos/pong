import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./model/player";
import { Game } from "./game";

const httpServer = createServer(express());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let games = new Map<String, Game>();

io.on("connection", (socket) => {
  /*socket.on("disconnect", () => {
    if (game) {
      game.removePlayer(socket);
      if (game.getPlayersSize == 0) {
        game = null;
      }
    }
  });*/

  socket.on("join", (data) => {
    if (games.size == 0 || !games.has(data.gameId)) {
      socket.emit("notFound");
      return;
    }

    let game = games.get(data.gameId);

    if (game) {
      if (game.getPlayersSize == 2) {
        socket.emit("gameIsFull");
        return;
      }

      if (game.addPlayer(socket, new Player(data.playerName, data.side, data.gameId))) {
        if (game.getPlayersSize == 2) {
          setInterval(() => {
            if (game) {
              io.emit("ballPosition", game.updateGameState(io));
            }
          }, 1);
        }
        socket.emit("join", data);
        socket.emit("ballPosition", game.getBall);
      } else {
        socket.emit("sideNotAvailabe");
        return;
      }
    }
  });

  socket.on("mouseMove", (data) => {
    let game = games.get(data.gameId);
    if (game) {
      if (data.side == "left") {
        game.updatePlayerPosition(socket, data, io);
      } else {
        game.updatePlayerPosition(socket, data, io);
      }
    }
  });

  /*socket.on("startMatch", () => {
    setInterval(() => {
      if (game) {
        io.emit("ballPosition", game.updateGameState(io));
      }
      io.on("gameOver", () => {
        game = null;
      });
    }, 1);
  });*/

  socket.on("globalChat", (data) => {
    io.emit("globalChat", data);
  });

  socket.on("roomChat", (data) => {
    socket.to(data.gameId).emit("roomChat", data);
  });

  socket.on("createRoom", (data) => {
    let game = new Game();
    game.addPlayer(socket, new Player(data.playerName, data.side, game.getGameId));
    games.set(game.getGameId, game);
    socket.join(game.getGameId);
    data.gameId = game.getGameId;
    socket.emit("join", data);
  });

});

httpServer.listen(3000, () => { });

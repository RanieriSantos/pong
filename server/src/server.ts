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

io.on("connection", (socket) => {
  let game: Game | null = new Game();

  socket.on("disconnect", () => {
    if (game) {
      game.removePlayer(socket);
      if (game.getPlayersSize == 0) {
        game = null;
      }
    }
  });

  socket.on("join", (data) => {
    if (game) {
      if (game.getPlayersSize == 2) {
        socket.emit("gameIsFull");
        return;
      }

      if (game.addPlayer(socket, new Player(data.playerName, data.side))) {
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
    if (game) {
      if (data.side == "left") {
        game.updatePlayerPosition(socket, data, io);
      } else {
        game.updatePlayerPosition(socket, data, io);
      }
    }
  });

  socket.on("startMatch", () => {
    setInterval(() => {
      if (game) {
        io.emit("ballPosition", game.updateGameState(io));
      }
      io.on("gameOver", () => {
        game = null;
      });
    }, 1);
  });
});

httpServer.listen(3000, () => {});

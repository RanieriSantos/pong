import { Server, Socket } from "socket.io";
import { Player } from "./model/player";

export class Game {
  static instance: Game | null;

  private players = new Map<Socket, Player>();

  private width = 1024;
  private height = 768;

  private ball = {
    x: this.width / 2,
    y: this.height / 2,
    radius: 25,
    velocityX: 0.2 * this.coinToss(),
    velocityY: 0.2 * this.coinToss(),
  };

  constructor() {
    if (Game.instance) {
      return Game.instance;
    }
    Game.instance = this;
  }

  findPlayerBySide(side: string) {
    for (let player of this.players) {
      if (player[1].getPlayerSide == side) {
        return player;
      }
    }
  }

  addPlayer(socket: Socket, new_player: Player) {
    for (let player of this.players.values()) {
      if (player.getPlayerSide == new_player.getPlayerSide) {
        return false;
      }
    }
    this.players.set(socket, new_player);
    return true;
  }

  removePlayer(socket: Socket) {
    this.players.delete(socket);
  }

  coinToss() {
    return Math.random() < 0.5 ? -1 : +1;
  }

  increaseScore(socket: Socket) {
    this.players.get(socket)?.increasePointsbyOne();
  }

  detectPaddleHit(
    ball: {
      x: number;
      y: number;
      radius: number;
      velocityY: number;
      velocityX: number;
    },
    paddleY: number,
    paddleHeight: number
  ) {
    const paddleTop = paddleY;
    const paddleBottom = paddleY + paddleHeight;

    // check for collision with left wall
    if (ball.x - ball.radius <= 20) {
      if (
        ball.y + ball.radius >= paddleTop - 100 &&
        ball.y - ball.radius <= paddleBottom - 100
      ) {
        ball.velocityY = -ball.velocityY;
        ball.velocityX = -ball.velocityX;
      }
    }

    // check for collision with right wall
    if (ball.x + ball.radius >= this.width - 20) {
      if (
        ball.y + ball.radius >= paddleTop - 100 &&
        ball.y - ball.radius <= paddleBottom - 100
      ) {
        ball.velocityY = -ball.velocityY;
        ball.velocityX = -ball.velocityX;
      }
    }
  }

  updateGameState(io: Server) {
    for (const [socket, player] of this.players.entries()) {
      this.detectPaddleHit(
        this.ball,
        player.paddlePosition,
        player.getPlayerHeight
      );
    }

    const ballHitTopOrBottom =
      this.ball.y - this.ball.radius <= 0 ||
      this.ball.y + this.ball.radius >= this.height;
    const ballHitLeftOrRight =
      this.ball.x - this.ball.radius <= 0 ||
      this.ball.x + this.ball.radius >= this.width;
    const ballHitLeft = this.ball.x - this.ball.radius <= 0;

    if (ballHitTopOrBottom) {
      this.ball.velocityY = -this.ball.velocityY;
    }

    if (ballHitLeftOrRight) {
      const playerSide = ballHitLeft ? "left" : "right";
      const player = this.findPlayerBySide(playerSide);
      if (player) {
        player[1].increasePointsbyOne();
        if (player[1].getPlayerPoints === 5) {
          io.emit("gameOver", player[1].getPlayerSide);
        }
        io.emit("increaseScore", player[1].getPlayerSide);
      }
      this.ball.velocityX = -this.ball.velocityX;
    }

    this.ball.x += this.ball.velocityX;
    this.ball.y += this.ball.velocityY;

    return this.ball;
  }

  updatePlayerPosition(socket: Socket, data: { y: number }, io: Server) {
    const player = this.players.get(socket);
    if (player) {
      if (!(data.y <= 0 || data.y >= this.height)) {
        player?.setPaddlePositionY(data.y);
        io.emit("mouseMove", data);
      }
    }
  }

  get getPlayersSize() {
    return this.players.size;
  }

  get getBall() {
    return this.ball;
  }
}

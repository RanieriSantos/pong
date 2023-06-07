enum Side {
  Left = "left",
  Right = "right",
}

export class Player {
  private playerName: string | undefined;
  private side: Side | undefined;
  private points: number = 0;
  private paddlePositionY: number = 0;
  private paddleHeight: number = 100;
  private paddleWidth: number = 15;

  constructor(player_name: string, side: Side) {
    this.playerName = player_name;
    this.side = side;
  }

  increasePointsbyOne() {
    return (this.points += 1);
  }

  setPaddlePositionY(paddlePositionY: number) {
    return (this.paddlePositionY = paddlePositionY);
  }

  get getPlayerSide() {
    return this.side;
  }

  get paddlePosition() {
    return this.paddlePositionY;
  }

  get getPlayerHeight() {
    return this.paddleHeight;
  }

  get getPlayerWidth() {
    return this.paddleWidth;
  }

  get getPlayerPoints() {
    return this.points;
  }
  
  get getPlayerName() {
    return this.playerName;
  }
}

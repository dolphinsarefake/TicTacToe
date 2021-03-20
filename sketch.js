/*
  Tic Tac Toe in JavaScript using p5.js
  (c) 2020-12-21 Raphael Volz (raphael.volz@hs-pforzheim.de)
  Wir Lieben Bennett  <3 
 */
let xArea, yArea;
let board;
let gameOver = false;
const X = 1;
const O = -1;
const SPACE = 4;
const none = 0;
const playerScore = document.getElementById("playerScore");
const player2Score = document.getElementById("player2Score");
const userurl = "https://mpume.csb.app/";
let apiUrl = "https://tictactoe.wntzn.com/api/games";
const socketUrl = "https://tictactoe.wntzn.com/";
const socket = io(socketUrl);
let gameData;
let player;
let size;
let params = new URL(document.location).searchParams;
const playerId = params.get("playerId");
const gameId = params.get("gameId");
const gameMessage = document.getElementById("game-message");
const gamerInviteButton = document.getElementById("invite-gamer");
gamerInviteButton.addEventListener("click", inviteLink);

// invite function
function inviteLink() {
  console.log("hi");
  const input = document.createElement("input");
  document.body.appendChild(input);
  let playerb = gameData.bPlayerId;
  input.value = userurl + "game.html?gameId=" + gameId + "&playerId=" + playerb;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

// Setup Function
function setup() {
  socket.emit("join", { gameId, playerId });
  // Teil 2: Empfangen und etwas ausgeben
  socket.on("gameData", (data) => {
    gameData = data;
    console.log("newData", data);

    redraw();

    let { aPlayerId, bPlayerId, gameStatus, aScore, bScore } = gameData;

    if (aPlayerId === playerId) {
      player = "a";
    } else if (bPlayerId === playerId) {
      player = "b";
    }
    //checkfunctions
    console.log(data);
    let nextGameButton =
      "<button   onclick='nextGame()' class='glow-on-hover' type='button'>Nächstes Spiel</button>";
    playerScore.innerText = aScore;
    player2Score.innerText = bScore;
    if (
      (gameStatus === "aTurn" && player === "a") ||
      (gameStatus === "bTurn" && player === "b")
    ) {
      gameMessage.innerHTML =
        "Dein Gegner fragt sich wie lange du noch brauchst..";
      gameMessage.className = "glow";
    } else if (
      (gameStatus === "aTurn" && player === "b") ||
      (gameStatus === "bTurn" && player === "a")
    ) {
      gameMessage.innerHTML = "Dein Gegner überlegt fieberhaft";
      gameMessage.className = "glow";
    } else if (
      (gameStatus === "aWon" && player === "a") ||
      (gameStatus === "bWon" && player === "b")
    ) {
      gameMessage.innerHTML = "Victory </br>" + nextGameButton + "</br>";
      gameMessage.className = "glow";
    } else if (gameStatus === "bWon" || gameData.gameStatus === "aWon") {
      gameMessage.innerHTML = "Verloren :( </br>" + nextGameButton + "</br>";
      gameMessage.className = "glow";
    } else if (gameStatus === "draw") {
      gameMessage.innerHTML = "Unentschieden </br>" + nextGameButton + "</br>";
      gameMessage.className = "glow";
    }
  });

  let size = min(windowHeight - 300, windowWidth - 300);
  let canvas = createCanvas(size, size);
  canvas.parent("Spielfeld");
  xArea = width / 3;
  yArea = height / 3;
  noLoop();
}

/* The main drawing loop*/
function draw() {
  if (gameData) {
    function drawBoard() {
      strokeWeight(7);
      stroke(255);
      //background(255, [255]);
      line(0, yArea, height, yArea);
      line(0, 2 * yArea, height, 2 * yArea);

      line(xArea, 0, xArea, width);
      line(2 * xArea, 0, 2 * xArea, width);
    }
    function drawXO() {
      for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
          if (gameData.board[i][j] === "b") drawX(i, j);
          else if (gameData.board[i][j] === "a") drawO(i, j);
        }
      }
    }
    function drawX(x, y) {
      strokeWeight(SPACE);

      line(
        x * xArea + SPACE,
        y * yArea + SPACE,
        x * xArea + xArea - SPACE,
        y * yArea + yArea - SPACE
      );
      line(
        x * xArea + SPACE,
        y * yArea + yArea - SPACE,
        x * xArea + xArea - SPACE,
        y * yArea + SPACE
      );
    }
    function drawO(x, y) {
      strokeWeight(SPACE);
      ellipseMode(CORNER);
      ellipse(
        x * xArea + SPACE,
        y * yArea + SPACE,
        xArea - 2 * SPACE,
        yArea - 2 * SPACE
      );
    }
    clear();
    drawBoard();
    drawXO();
  }
}
function mousePressed() {
  console.log("testing");
  // Ist das zulässig ?
  const { gameStatus, aPlayerId, bPlayerId } = gameData;
  if (
    (gameStatus === "aTurn" && player === "a") ||
    (gameStatus === "bTurn" && player === "b")
  ) {
    let x = Math.floor(mouseX / xArea);
    let y = Math.floor(mouseY / yArea);
    if (x < 3 && y < 3) {
      if (gameData.board[x][y] === 0) {
        gameData.board[x][y] = player;
        gameData.playerId = playerId;
        console.log(gameData.board);
        socket.emit("gameProgress", gameData);
        redraw();
      }
    }
  }
}

function nextGame() {
  gameData.playerId = playerId;
  gameData.playerId = socket.emit("nextGame", gameData);
}
